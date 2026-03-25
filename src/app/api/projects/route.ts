import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Simple in-memory store for demo (replace with database)
let projectsStore: any[] = [];

async function verifyAuth(request: NextRequest) {
  // Verify Bearer token from Authorization header
  const headersList = await headers();
  const authHeader = headersList.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  // TODO: Verify token against Firebase or your auth system
  // For now, accept any token in development
  if (process.env.NODE_ENV === 'production' && !token) {
    return null;
  }
  
  return token;
}

// GET /api/projects - Get all projects (public)
export async function GET(request: NextRequest) {
  try {
    // Return projects as JSON
    return NextResponse.json({
      success: true,
      data: projectsStore,
      count: projectsStore.length
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project (requires auth)
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const { name, description, tech, image, demo, github, drive } = body;
    
    if (!name || !description || !Array.isArray(tech) || !image) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new project
    const newProject = {
      id: Date.now().toString(),
      name,
      description,
      tech,
      image,
      demo: demo || null,
      github: github || null,
      drive: drive || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    projectsStore.push(newProject);

    return NextResponse.json(
      {
        success: true,
        data: newProject,
        message: 'Project created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
