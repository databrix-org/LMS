from django.test import TestCase
from django.core.exceptions import ValidationError
from .models import CustomUserModel, Course, Workspace, CourseMembership

# Create your tests here.

class CustomUserModelTests(TestCase):
    def setUp(self):
        self.user = CustomUserModel.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )

    def test_user_creation(self):
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertEqual(self.user.get_full_name(), 'Test User')
        self.assertEqual(self.user.get_short_name(), 'Test')
        self.assertTrue(self.user.is_active)
        self.assertFalse(self.user.is_staff)

class CourseTests(TestCase):
    def setUp(self):
        self.user = CustomUserModel.objects.create_user(
            email='teacher@example.com',
            password='testpass123',
            first_name='Teacher',
            last_name='User'
        )
        self.course = Course.objects.create(
            name='Test Course',
            description='Test Description',
            jupyterhub_url='https://jupyter.example.com/course1',
            owner=self.user
        )

    def test_course_creation(self):
        self.assertEqual(str(self.course), f"Test Course (by Teacher User)")
        self.assertEqual(self.course.owner, self.user)

    def test_unique_course_name_per_owner(self):
        duplicate_course = Course(
            name='Test Course',  # Same name as existing course
            jupyterhub_url='https://jupyter.example.com/course2',
            owner=self.user  # Same owner
        )
        with self.assertRaises(ValidationError):
            duplicate_course.full_clean()

class WorkspaceTests(TestCase):
    def setUp(self):
        self.user = CustomUserModel.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.course = Course.objects.create(
            name='Test Course',
            jupyterhub_url='https://jupyter.example.com/course1',
            owner=self.user
        )

    def test_valid_workspace_url(self):
        workspace = Workspace.objects.create(
            name='Test Workspace',
            course=self.course,
            workspace_url='https://jupyter.example.com/course1/workspace1'
        )
        self.assertEqual(str(workspace), "Test Workspace - Test Course")

    def test_invalid_workspace_url(self):
        with self.assertRaises(ValidationError):
            Workspace.objects.create(
                name='Invalid Workspace',
                course=self.course,
                workspace_url='https://different-domain.com/workspace'
            )

class CourseMembershipTests(TestCase):
    def setUp(self):
        self.teacher = CustomUserModel.objects.create_user(
            email='teacher@example.com',
            password='testpass123',
            first_name='Teacher',
            last_name='User'
        )
        self.student = CustomUserModel.objects.create_user(
            email='student@example.com',
            password='testpass123',
            first_name='Student',
            last_name='User'
        )
        self.course = Course.objects.create(
            name='Test Course',
            jupyterhub_url='https://jupyter.example.com/course1',
            owner=self.teacher
        )
        self.workspace = Workspace.objects.create(
            name='Test Workspace',
            course=self.course,
            workspace_url='https://jupyter.example.com/course1/workspace1'
        )

    def test_course_membership_roles(self):
        teacher_membership = CourseMembership.objects.create(
            course=self.course,
            user=self.teacher,
            role='teacher',
            workspace=self.workspace
        )
        student_membership = CourseMembership.objects.create(
            course=self.course,
            user=self.student,
            role='student',
            workspace=self.workspace
        )

        self.assertTrue(teacher_membership.is_teacher)
        self.assertFalse(teacher_membership.is_student)
        self.assertTrue(student_membership.is_student)
        self.assertFalse(student_membership.is_ta)

    def test_unique_membership(self):
        # First membership
        CourseMembership.objects.create(
            course=self.course,
            user=self.student,
            role='student'
        )
        
        # Try to create duplicate membership
        duplicate_membership = CourseMembership(
            course=self.course,
            user=self.student,  # Same user in same course
            role='student'
        )
        
        with self.assertRaises(ValidationError):
            duplicate_membership.full_clean()

    def test_workspace_url_access(self):
        membership = CourseMembership.objects.create(
            course=self.course,
            user=self.student,
            role='student',
            workspace=self.workspace
        )
        
        self.assertEqual(
            membership.get_workspace_url(),
            'https://jupyter.example.com/course1/workspace1'
        )
