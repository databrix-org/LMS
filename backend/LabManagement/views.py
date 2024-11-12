from django.shortcuts import render, redirect
from django.http import JsonResponse
from datetime import timedelta

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import (
    CustomUserModel, Course, Category, Tag, Enrollment,
    Module, Lesson, Video, Text, Quiz, LessonProgress
)
from .serializers import (
    CustomUserSerializer, CourseSerializer, CategorySerializer,
    TagSerializer, EnrollmentSerializer, ModuleSerializer,
    LessonSerializer, VideoSerializer, TextSerializer, QuizSerializer, LessonProgressSerializer
)
import logging

logger = logging.getLogger(__name__)

class GoogleLogin(SocialLoginView): # if you want to use Authorization Code Grant, use this
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000/"
    client_class = OAuth2Client

def email_confirmation(request, key):
    return redirect(f"http://localhost:3000/dj-rest-auth/registration/account-confirm-email/{key}")

def reset_password_confirm(request, uid, token):
    return redirect(f"http://localhost:3000/reset/password/confirm/{uid}/{token}")

class IsInstructorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.is_instructor

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes =[permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        course = self.get_object()
        user = request.user
        
            
        if Enrollment.objects.filter(student=user, course=course).exists():
            return Response(
                {"error": "Already enrolled in this course"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        Enrollment.objects.create(student=user, course=course)
        return Response({"message": "Successfully enrolled"}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def content(self, request, pk):
        course_pk = self.get_object()
        
        # Get all modules for this course with their lessons
        modules = Module.objects.filter(course=course_pk).prefetch_related('lessons')
        
        # Structure the response
        course_data = CourseSerializer(course_pk).data
        course_data['modules'] = []
        
        for module in modules:
            module_data = ModuleSerializer(module).data
            module_data['lessons'] = LessonSerializer(module.lessons.all(), many=True).data
            course_data['modules'].append(module_data)
            
        return Response(course_data)
    
    @action(detail=True, methods=['get'])
    def progress(self, request, pk=None):
        course = get_object_or_404(Course, pk=pk)
        try:
            module_progress = {}
            for module in course.modules.all():  
                lesson_progress = {}
                for lesson in module.lessons.all():  
                    # Get progress record
                    progress, created = LessonProgress.objects.get_or_create(
                        student=request.user,
                        lesson=lesson,
                        defaults={'is_completed': False}
                    )
                    lesson_progress[lesson.id] = progress.is_completed
                module_progress[module.id] = lesson_progress

            return Response(module_progress, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching lesson progress: {str(e)}", exc_info=True)
            return Response(
                {"error": "An error occurred while fetching lesson progress"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsInstructorOrReadOnly]

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsInstructorOrReadOnly]

class ModuleViewSet(viewsets.ModelViewSet):
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Module.objects.filter(course_id=self.kwargs['course_pk'])

    def perform_create(self, serializer):
        course = get_object_or_404(Course, pk=self.kwargs['course_pk'])
        serializer.save(course=course)

class LessonViewSet(viewsets.ModelViewSet):
    serializer_class = LessonSerializer
    lesson_progress_serializer_class = LessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Lesson.objects.filter(module_id=self.kwargs.get('module_pk'))

    def perform_create(self, serializer):
        module = get_object_or_404(Module, pk=self.kwargs['module_pk'])
        serializer.save(module=module)
        
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None, module_pk=None, course_pk=None):
        lesson = get_object_or_404(Lesson, pk=pk, module_id=module_pk)
        try:
            # Create or update the lesson progress
            lesson_progress, created = LessonProgress.objects.get_or_create(
                student=request.user,
                lesson=lesson,
                defaults={'is_completed': True}
            )
            
            if not created:
                lesson_progress.is_completed = True
                lesson_progress.save()

            return Response(
                {"message": "Lesson progress marked as completed"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error completing lesson progress: {str(e)}", exc_info=True)
            return Response(
                {"error": "An error occurred while completing the lesson"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class EnrollmentViewSet(viewsets.ModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        logger.debug(f"User requesting enrollments: {self.request.user}")
        try:
            enrollments = Enrollment.objects.filter(student=self.request.user).select_related('course')
            logger.debug(f"Found enrollments: {enrollments.count()}")
            return enrollments
        except Exception as e:
            logger.error(f"Error in EnrollmentViewSet.get_queryset: {str(e)}", exc_info=True)
            return Enrollment.objects.none()

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            logger.debug(f"Serialized data: {serializer.data}")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in EnrollmentViewSet.list: {str(e)}", exc_info=True)
            return Response(
                {"error": "An error occurred while fetching enrollments"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )