from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import (
    CustomUserModel, Course, Category, Tag, Enrollment,
    Module, Lesson, Video, Text, Quiz, Question, Choice,
    Submission, Answer, Certificate, Announcement,
    Thread, Post, Review, Notification, StudentProfile,
    InstructorProfile
)

# Register your models here.
class UserAdminCustom(UserAdmin):
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "is_instructor",
                    "is_student",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {"classes": ("wide",), "fields": ("email", "first_name", "last_name", "password1", "password2"),},
        ),
    )
    list_display = ("email", "first_name", "last_name", "is_staff", "is_instructor", "is_student")
    search_fields = ("first_name", "last_name", "email")
    ordering = ("email",)
    readonly_fields = ['date_joined', 'last_login']

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'created_at', 'difficulty_level')
    list_filter = ('difficulty_level', 'created_at', 'instructor')
    search_fields = ('title', 'description')
    filter_horizontal = ('categories', 'tags')
    date_hierarchy = 'created_at'

admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(Enrollment)
admin.site.register(Module)
admin.site.register(Lesson)
admin.site.register(Video)
admin.site.register(Text)
admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Choice)
admin.site.register(Submission)
admin.site.register(Answer)
admin.site.register(Certificate)
admin.site.register(Announcement)
admin.site.register(Thread)
admin.site.register(Post)
admin.site.register(Review)
admin.site.register(Notification)
admin.site.register(StudentProfile)
admin.site.register(InstructorProfile)
admin.site.register(CustomUserModel)
