import { getPrismaClient, runOptionalDatabaseQuery } from "@/lib/db/prisma";

export type ContactSubmissionInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactSubmissionStatus = "NEW" | "REVIEWING" | "RESPONDED" | "ARCHIVED";

export type StoredContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: ContactSubmissionStatus;
  createdAt: string;
};

type ContactSubmissionDb = {
  contactSubmission: {
    create: (args: {
      data: {
        name: string;
        email: string;
        message: string;
      };
    }) => Promise<{
      id: string;
      name: string;
      email: string;
      message: string;
      status: string;
    }>;
  };
};

function normalizeSubmissionStatus(status: string): ContactSubmissionStatus {
  if (status === "NEW" || status === "REVIEWING" || status === "RESPONDED" || status === "ARCHIVED") {
    return status;
  }

  return "NEW";
}

export async function createStoredContactSubmission(
  input: ContactSubmissionInput,
  db: ContactSubmissionDb = getPrismaClient() as unknown as ContactSubmissionDb
) {
  return db.contactSubmission.create({
    data: {
      name: input.name,
      email: input.email,
      message: input.message
    }
  });
}

export async function listStoredContactSubmissions(): Promise<StoredContactSubmission[]> {
  return (
    (await runOptionalDatabaseQuery(async (db): Promise<StoredContactSubmission[]> => {
      const submissions = await db.contactSubmission.findMany({
        orderBy: {
          createdAt: "desc"
        }
      });

      return submissions.map((submission): StoredContactSubmission => ({
        id: submission.id,
        name: submission.name,
        email: submission.email,
        message: submission.message,
        status: normalizeSubmissionStatus(String(submission.status)),
        createdAt: submission.createdAt.toISOString()
      }));
    })) ?? []
  );
}

export async function updateStoredContactSubmissionStatus(
  submissionId: string,
  status: ContactSubmissionStatus
) {
  return getPrismaClient().contactSubmission.update({
    where: {
      id: submissionId
    },
    data: {
      status
    }
  });
}
