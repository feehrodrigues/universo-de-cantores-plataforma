import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/teacher/students
 * Get all students for an instructor
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const instructor = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!instructor) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all unique students from instructor's classes
    const classes = await prisma.class.findMany({
      where: { instructorId: instructor.id },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            studentProfile: {
              select: {
                lessonBalance: true,
                monthlyLessonsUsed: true,
                generalGoal: true,
              },
            },
          },
        },
        report: {
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
    });

    // Create a Map to deduplicate students and track their stats
    const studentMap = new Map();
    let totalClassCount = 0;

    classes.forEach((classItem) => {
      classItem.students.forEach((student) => {
        if (!studentMap.has(student.id)) {
          studentMap.set(student.id, {
            ...student,
            classCount: 0,
            lastClass: null,
          });
        }

        const studentData = studentMap.get(student.id)!;
        studentData.classCount++;
        if (!studentData.lastClass) {
          studentData.lastClass = classItem.report?.createdAt;
        }
      });

      if (classItem.report) {
        totalClassCount++;
      }
    });

    const students = Array.from(studentMap.values());

    return NextResponse.json({
      students,
      stats: {
        totalStudents: students.length,
        totalClasses: classes.length,
        completedClasses: totalClassCount,
      },
    });
  } catch (error) {
    console.error('Teachers students error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
