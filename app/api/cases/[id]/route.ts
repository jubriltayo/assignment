import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";

    const response = await fetch(`${backendUrl}/api/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation UpdateCase($id: ID!, $input: UpdateCaseInput!) {
            updateCase(id: $id, input: $input) {
              id name caseType country processStatus 
              stepsCompleted totalSteps expectedCompletionDate createdAt
            }
          }
        `,
        variables: { id, input: body },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0]?.message);
    }

    return NextResponse.json({
      success: true,
      case: result.data.updateCase,
    });
  } catch (error) {
    console.error("Error updating case:", error);
    return NextResponse.json(
      {
        error: "Failed to update case",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";

    const response = await fetch(`${backendUrl}/api/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `mutation DeleteCase($id: ID!) { deleteCase(id: $id) }`,
        variables: { id },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0]?.message);
    }

    return NextResponse.json({
      success: result.data.deleteCase,
    });
  } catch (error) {
    console.error("Error deleting case:", error);
    return NextResponse.json(
      {
        error: "Failed to delete case",
      },
      {
        status: 500,
      }
    );
  }
}
