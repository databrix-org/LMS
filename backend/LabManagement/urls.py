from django.urls import path, include
from rest_framework_nested import routers
from . import views

# Create main router
router = routers.DefaultRouter()
router.register(r'courses', views.CourseViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'tags', views.TagViewSet)
router.register(r'enrollments', views.EnrollmentViewSet, basename='enrollment')

# Create nested router for modules within courses
courses_router = routers.NestedDefaultRouter(router, r'courses', lookup='course')
courses_router.register(r'modules', views.ModuleViewSet, basename='course-modules')

# Create nested router for lessons within modules
modules_router = routers.NestedDefaultRouter(courses_router, r'modules', lookup='module')
modules_router.register(r'lessons', views.LessonViewSet, basename='module-lessons')


urlpatterns = [
    path('', include(router.urls)),
    path('', include(courses_router.urls)),
    path('', include(modules_router.urls)),
]