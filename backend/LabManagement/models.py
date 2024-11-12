from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager
from datetime import timedelta

# Create your models here.
class CustomUserModel(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("Email Address"), unique=True, max_length=255)
    first_name = models.CharField(_("First Name"), max_length=100)
    last_name = models.CharField(_("Last Name"), max_length=100)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    is_instructor = models.BooleanField(default=False)
    is_student = models.BooleanField(default=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['first_name', 'last_name','is_instructor','is_student','is_staff']),
        ]

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def get_short_name(self):
        return self.first_name



# Profile Models (Optional)
class StudentProfile(models.Model):
    user = models.OneToOneField(CustomUserModel, on_delete=models.CASCADE, related_name='student_profile')
    # Additional student-specific fields


class InstructorProfile(models.Model):
    user = models.OneToOneField(CustomUserModel, on_delete=models.CASCADE, related_name='instructor_profile')
    # Additional instructor-specific fields


# Category and Tag Models
class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


# Course Model
class Course(models.Model):
    DIFFICULTY_CHOICES = (
        (1, 'Beginner'),
        (2, 'Intermediate'),
        (3, 'Advanced'),
        (4, 'Professional'),
    )
    title = models.CharField(max_length=255, default="Untitled Course")
    description = models.TextField(default="No description")
    instructor = models.ForeignKey(
        CustomUserModel, on_delete=models.CASCADE, related_name='courses',
        limit_choices_to={'is_instructor': True},
        null=True,
        blank=True
    )
    categories = models.ManyToManyField(Category, related_name='courses', blank=True)
    tags = models.ManyToManyField(Tag, related_name='courses', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    difficulty_level = models.IntegerField(
        choices=DIFFICULTY_CHOICES,
        default=1,
        help_text="Course difficulty level"
    )
    # Additional fields

    def __str__(self):
        return self.title


# Enrollment Model
class Enrollment(models.Model):
    student = models.ForeignKey(
        CustomUserModel, on_delete=models.CASCADE, related_name='enrollments',
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    progress = models.FloatField(default=0.0)

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student.first_name} enrolled in {self.course.title}"


# Module Model
class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.title} ({self.course.title})"


# Lesson Model
class Lesson(models.Model):
    LESSON_TYPES = (
        ('video', 'Video Lesson'),
        ('reading', 'Reading Material'),
        ('exercise', 'Practice Exercise'),
    )
    
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField()
    lesson_type = models.CharField(
        max_length=20,
        choices=LESSON_TYPES,
        default='reading',
        help_text="Type of lesson content"
    )
    duration = models.DurationField(default=timedelta(minutes=10), help_text="Expected time to complete this lesson")
    description = models.TextField(blank=True, null=True)
    # New fields for content
    video_url = models.URLField(blank=True, null=True, help_text="URL for lesson video content")
    video_duration = models.DurationField(null=True, blank=True, help_text="Duration of the video")
    lesson_content = models.TextField(blank=True, null=True, help_text="Main lesson content/text material")
    additional_resources = models.TextField(blank=True, null=True, help_text="Additional learning resources or links")
    exercise = models.TextField(blank=True, null=True, help_text="Practice exercise for the lesson")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.title} ({self.module.title})"


# Abstract Content Model with Dynamic `related_name`
class Content(models.Model):
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='%(class)s_set'
    )
    order = models.PositiveIntegerField()

    class Meta:
        abstract = True
        ordering = ['order']

    def __str__(self):
        return f"Content in {self.lesson.title}"


# Video Content Model
class Video(Content):
    title = models.CharField(max_length=255)
    video_file = models.FileField(upload_to='videos/')
    duration = models.DurationField()

    def __str__(self):
        return f"Video: {self.title}"


# Text Content Model
class Text(Content):
    title = models.CharField(max_length=255)
    content = models.TextField()

    def __str__(self):
        return f"Text: {self.title}"


# Quiz Content Model
class Quiz(Content):
    title = models.CharField(max_length=255)

    def __str__(self):
        return f"Quiz: {self.title}"


# Question Model
class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    question_type = models.CharField(max_length=50, choices=(
        ('multiple-choice', 'Multiple Choice'),
        ('true-false', 'True/False'),
        ('short-answer', 'Short Answer'),
    ))

    def __str__(self):
        return f"Question: {self.text}"


# Choice Model
class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text


# Submission Model
class Submission(models.Model):
    student = models.ForeignKey(
        CustomUserModel, on_delete=models.CASCADE, related_name='submissions',
        limit_choices_to={'is_student': True}
    )
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='submissions')
    submitted_at = models.DateTimeField(auto_now_add=True)
    score = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.student.username}'s submission for {self.quiz.title}"


# Answer Model
class Answer(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_choice = models.ForeignKey(Choice, on_delete=models.CASCADE, null=True, blank=True)
    text_answer = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Answer to {self.question.text}"


# Certificate Model
class Certificate(models.Model):
    student = models.ForeignKey(
        CustomUserModel, on_delete=models.CASCADE, related_name='certificates',
        limit_choices_to={'is_student': True}
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='certificates')
    issued_at = models.DateTimeField(auto_now_add=True)
    certificate_file = models.FileField(upload_to='certificates/')

    def __str__(self):
        return f"Certificate for {self.student.username} in {self.course.title}"


# Announcement Model
class Announcement(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='announcements')
    title = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Announcement: {self.title}"


# Discussion Forum Models
class Thread(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='threads')
    starter = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Thread: {self.title}"


class Post(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name='posts')
    author = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')

    def __str__(self):
        return f"Post by {self.author.username} in {self.thread.title}"


# Review Model
class Review(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    student = models.ForeignKey(
        CustomUserModel, on_delete=models.CASCADE, related_name='reviews',
        limit_choices_to={'is_student': True}
    )
    rating = models.PositiveIntegerField()
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('course', 'student')

    def __str__(self):
        return f"Review by {self.student.username} for {self.course.title}"


# Notification Model (Optional)
class Notification(models.Model):
    recipient = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    link = models.URLField(blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.recipient.username}"


# Lesson Progress Model
class LessonProgress(models.Model):
    student = models.ForeignKey(
        CustomUserModel, 
        on_delete=models.CASCADE, 
        related_name='lesson_progress',
    )
    lesson = models.ForeignKey(
        Lesson, 
        on_delete=models.CASCADE, 
        related_name='student_progress'
    )
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    last_accessed = models.DateTimeField(auto_now=True)
    time_spent = models.DurationField(default=timedelta(minutes=0))

    class Meta:
        unique_together = ('student', 'lesson')
        indexes = [
            models.Index(fields=['student', 'lesson']),
            models.Index(fields=['is_completed']),
        ]

    def __str__(self):
        return f"{self.student.get_full_name()} - {self.lesson.title} Progress"