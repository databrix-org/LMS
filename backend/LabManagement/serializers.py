from rest_framework import serializers
from .models import (
    CustomUserModel, Course, Category, Tag, Enrollment,
    Module, Lesson, Video, Text, Quiz, Question, Choice,
    Submission, Answer, Certificate, Announcement,
    Thread, Post, Review, Notification, LessonProgress
)

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUserModel
        fields = ['id','email','first_name','last_name','is_instructor','is_student']
        read_only_fields = ['id']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    instructor = CustomUserSerializer(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    difficulty_level_display = serializers.CharField(source='get_difficulty_level_display', read_only=True)

    class Meta:
        model = Course
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    course_id = serializers.SerializerMethodField()
    module_id = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = '__all__'

    def get_course_id(self, obj):
        return obj.module.course.id if obj.module else None

    def get_module_id(self, obj):
        return obj.module.id if obj.module else None

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'

class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Text
        fields = '__all__'

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = '__all__'

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'enrolled_at', 'progress']

    def get_progress(self, obj):
        # Get all lessons for the course
        lessons = Lesson.objects.filter(module__course=obj.course)
        
        # Get completed lessons through LessonProgress
        completed_lessons = LessonProgress.objects.filter(
            student=obj.student,
            lesson__in=lessons,
            is_completed=True
        ).count()
        
        total_lessons = lessons.count()
        if total_lessons == 0:
            return 0
            
        return round( (completed_lessons / total_lessons) * 100)

class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ['id', 'student', 'lesson', 'is_completed', 'completed_at', 'last_accessed', 'time_spent']
        read_only_fields = ['student']

