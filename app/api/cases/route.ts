import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";

    const response = await fetch(`${backendUrl}/api/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation CreateCase($input: CreateCaseInput!) {
            createCase(input: $input) {
              id name caseType country processStatus 
              stepsCompleted totalSteps expectedCompletionDate createdAt
            }
          }
        `,
        variables: { input: body },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0]?.message);
    }

    return NextResponse.json({
      success: true,
      case: result.data.createCase,
    });
  } catch (error) {
    console.error("Error creating case:", error);
    return NextResponse.json(
      { error: "Failed to create case" },
      { status: 500 }
    );
  }
}
