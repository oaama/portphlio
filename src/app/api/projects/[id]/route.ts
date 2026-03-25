import { NextRequest, NextResponse } from 'next/server';

// In-memory store (replace with database)
let projectsStore: any[] = [
  {
    id: 'demo-1',
    name: 'Demo Project',
    description: 'This is a demo project',
    tech: ['Next.js', 'React'],
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    demo: 'https://example.com',
    github: 'https://github.com/example',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * GET /api/projects/[id]
 * Get specific project by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = projectsStore.find(p => p.id === id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/[id]
 * Update project by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const projectIndex = projectsStore.findIndex(p => p.id === id);

    if (projectIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, tech, image, demo, github, drive } = body;

    // Update with provided fields
    projectsStore[projectIndex] = {
      ...projectsStore[projectIndex],
      ...(name && { name }),
      ...(description && { description }),
      ...(tech && { tech }),
      ...(image && { image }),
      ...(demo !== undefined && { demo }),
      ...(github !== undefined && { github }),
      ...(drive !== undefined && { drive }),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: projectsStore[projectIndex],
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[id]
 * Delete project by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const projectIndex = projectsStore.findIndex(p => p.id === id);

    if (projectIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const deletedProject = projectsStore.splice(projectIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedProject,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
