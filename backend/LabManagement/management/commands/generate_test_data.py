from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from LabManagement.models import (
    Course, Module, Lesson, Video, Text, Quiz,
    Question, Choice, Category, Tag, Enrollment
)
from datetime import timedelta

class Command(BaseCommand):
    help = 'Generates test data for the Lab Management system'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        
        # Create or get instructor
        instructor, created = User.objects.get_or_create(
            email='instructor@test.com',
            defaults={
                'first_name': 'Test',
                'last_name': 'Instructor',
                'is_instructor': True,
                'is_student': False
            }
        )
        if created:
            instructor.set_password('testpass123')
            instructor.save()
        
        # Create or get student
        student, created = User.objects.get_or_create(
            email='student@test.com',
            defaults={
                'first_name': 'Test',
                'last_name': 'Student',
                'is_instructor': False,
                'is_student': True
            }
        )
        if created:
            student.set_password('testpass123')
            student.save()

        # Delete existing test data
        Course.objects.filter(instructor=instructor).delete()
        Category.objects.all().delete()
        Tag.objects.all().delete()

        # Create categories and tags
        categories = [
            Category.objects.create(name=name) for name in 
            ['Programming', 'Data Science', 'Web Development']
        ]
        
        tags = [
            Tag.objects.create(name=name) for name in 
            ['Python', 'JavaScript', 'Machine Learning', 'Django', 'React', 'SQL']
        ]

        # Create courses
        course_data = [
            {
                'title': 'Introduction to Python',
                'description': 'Learn Python basics',
                'difficulty_level': 1
            },
            {
                'title': 'Advanced JavaScript',
                'description': 'Master JavaScript concepts',
                'difficulty_level': 3
            },
            {
                'title': 'Machine Learning Fundamentals',
                'description': 'Basic ML concepts',
                'difficulty_level': 2
            },
            {
                'title': 'Django Web Development',
                'description': 'Build web apps with Django',
                'difficulty_level': 2
            },
            {
                'title': 'React Advanced Patterns',
                'description': 'Advanced React concepts',
                'difficulty_level': 4
            },
            {
                'title': 'Database Design',
                'description': 'Learn SQL and database design',
                'difficulty_level': 1
            }
        ]

        courses = []
        for course_info in course_data:
            course = Course.objects.create(
                instructor=instructor,
                **course_info
            )
            # Add random categories and tags
            course.categories.add(categories[0])
            course.tags.add(tags[0], tags[1])
            courses.append(course)

            # Create modules for each course
            for i in range(1, 4):
                module = Module.objects.create(
                    course=course,
                    title=f'Module {i}',
                    order=i
                )

                # Create lessons for each module
                for j in range(1, 4):
                    lesson = Lesson.objects.create(
                        module=module,
                        title=f'Lesson {j}: {self._get_lesson_title(course, i, j)}',
                        order=j,
                        lesson_type=self._get_lesson_type(j),
                        duration=timedelta(minutes=30),
                        description=self._get_lesson_description(course, i, j),
                        video_url=f'https://www.youtube.com/watch?v=Fh0JDN9LblE',
                        video_duration=timedelta(minutes=15),
                        lesson_content=self._get_lesson_content(course, i, j),
                        additional_resources=self._get_additional_resources(course, i, j)
                    )

                    # Add content to lessons
                    Video.objects.create(
                        lesson=lesson,
                        title=f'Video {j}',
                        video_file='videos/sample.mp4',
                        duration=timedelta(minutes=15),
                        order=1
                    )

                    Text.objects.create(
                        lesson=lesson,
                        title=f'Reading Material {j}',
                        content='Sample content for this lesson...',
                        order=2
                    )

                    quiz = Quiz.objects.create(
                        lesson=lesson,
                        title=f'Quiz {j}',
                        order=3
                    )

                    # Create questions for quiz
                    question = Question.objects.create(
                        quiz=quiz,
                        text=f'Sample question {j}?',
                        question_type='multiple-choice'
                    )

                    # Create choices for question
                    Choice.objects.create(
                        question=question,
                        text='Correct answer',
                        is_correct=True
                    )
                    Choice.objects.create(
                        question=question,
                        text='Wrong answer',
                        is_correct=False
                    )

        # Delete existing enrollments and create new ones
        Enrollment.objects.filter(student=student).delete()
        
        # Enroll student in 3 courses
        for course in courses[:3]:
            Enrollment.objects.create(
                student=student,
                course=course,
                progress=0.0
            )

        self.stdout.write(self.style.SUCCESS('Successfully generated test data')) 

    def _get_lesson_title(self, course, module_num, lesson_num):
        titles = {
            'Introduction to Python': [
                ['Getting Started with Python', 'Variables and Data Types', 'Basic Operations'],
                ['Control Flow', 'Loops and Iterations', 'Functions Basics'],
                ['Lists and Tuples', 'Dictionaries and Sets', 'File Handling']
            ],
            'Advanced JavaScript': [
                ['ES6+ Features', 'Arrow Functions', 'Destructuring'],
                ['Promises', 'Async/Await', 'Error Handling'],
                ['Modules', 'Classes', 'Design Patterns']
            ],
            'Machine Learning Fundamentals': [
                ['Introduction to ML', 'Data Preprocessing', 'Feature Engineering'],
                ['Supervised Learning', 'Classification', 'Regression'],
                ['Model Evaluation', 'Cross Validation', 'Hyperparameter Tuning']
            ]
        }
        
        default_titles = [
            ['Introduction', 'Core Concepts', 'Basic Implementation'],
            ['Advanced Topics', 'Best Practices', 'Common Patterns'],
            ['Real-world Examples', 'Case Studies', 'Final Project']
        ]
        
        return titles.get(course.title, default_titles)[module_num-1][lesson_num-1]

    def _get_lesson_type(self, lesson_num):
        # Rotate through different lesson types
        types = ['video', 'reading', 'exercise']
        return types[(lesson_num - 1) % 3]

    def _get_lesson_description(self, course, module_num, lesson_num):
        return f"""
        This lesson covers important concepts related to {self._get_lesson_title(course, module_num, lesson_num)}.
        You will learn through a combination of video lectures, reading materials, and hands-on exercises.
        By the end of this lesson, you will be able to implement these concepts in real-world scenarios.
        """

    def _get_lesson_content(self, course, module_num, lesson_num):
        return f"""
        # {self._get_lesson_title(course, module_num, lesson_num)}

        ## Overview
        In this lesson, we'll explore the fundamental concepts and practical applications.

        ## Key Points
        1. Understanding the basics
        2. Implementation details
        3. Best practices
        4. Common pitfalls to avoid

        ## Examples
        ```python
        # Sample code or examples
        def example():
            return "This is a sample implementation"
        ```

        ## Summary
        We've covered the essential aspects of this topic. Practice with the exercises to reinforce your learning.
        """

    def _get_additional_resources(self, course, module_num, lesson_num):
        return f"""
        - Official Documentation: https://docs.example.com/{course.title.lower().replace(' ', '-')}
        - Related Tutorial: https://tutorial.example.com/lesson-{module_num}-{lesson_num}
        - Practice Exercises: https://exercises.example.com/{course.title.lower().replace(' ', '-')}/module-{module_num}
        - Community Discussion: https://forum.example.com/topic-{module_num}-{lesson_num}
        """