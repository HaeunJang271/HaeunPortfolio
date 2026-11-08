import type { ProjectDocument } from "@/types/content";
import { getFirebaseAdmin } from "@/lib/firebase/admin";

// Source facts supplied for initial records. These stay unpublished until reviewed.
export const seedProjects: ProjectDocument[] = [
  {
    id: "haeun-16", slug: "haeun-16", title: "HAEUN-16",
    description: { ko: "커스텀 16비트 CPU 아키텍처 프로젝트.", en: "A custom 16-bit CPU architecture project." },
    details: { ko: "CPU 아키텍처, 인터럽트 처리, 타이머, RAM / ROM 구현 영역이 보고되었습니다. 세부 내용은 관리자 확인 후 공개됩니다.", en: "Reported implementation areas include CPU architecture, interrupt handling, a timer, and RAM / ROM. Further details await administrator review." },
    sections: {}, role: null, period: null,
    techStack: ["Verilog-2001", "FPGA", "Gowin"], category: "hardware", thumbnail: null, gallery: [], githubUrl: null, liveUrl: null,
    status: "unknown", featured: false, published: false, createdAt: "", updatedAt: "",
  },
  {
    id: "vimeo-portfolio", slug: "vimeo-portfolio", title: "VimeoPortfolio",
    description: { ko: "인증, Firestore, Storage, Vimeo API를 활용한 비디오 포트폴리오.", en: "A video portfolio using authentication, Firestore, Storage, and the Vimeo API." },
    details: { ko: "인증, Firestore, Storage, 비디오 포트폴리오, 배포 영역이 보고되었습니다. 세부 내용은 관리자 확인 후 공개됩니다.", en: "Reported implementation areas include authentication, Firestore, Storage, video portfolio, and deployment. Further details await administrator review." },
    sections: {}, role: null, period: null,
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase", "Vimeo API", "Framer Motion"], category: "web", thumbnail: null, gallery: [], githubUrl: null, liveUrl: null,
    status: "unknown", featured: false, published: false, createdAt: "", updatedAt: "",
  },
  {
    id: "yourdentity-lab", slug: "yourdentity-lab", title: "Yourdentity LAB",
    description: { ko: "프로젝트 설명은 확인 후 공개됩니다.", en: "Project details will be published after verification." }, details: { ko: "", en: "" }, sections: {}, role: null, period: null,
    techStack: ["Next.js", "TypeScript", "PWA", "shadcn/ui"], category: "web", thumbnail: null, gallery: [], githubUrl: null, liveUrl: null,
    status: "unknown", featured: false, published: false, createdAt: "", updatedAt: "",
  },
  {
    id: "the-witchery", slug: "the-witchery", title: "THE WITCHERY",
    description: { ko: "프로젝트 설명은 확인 후 공개됩니다.", en: "Project details will be published after verification." }, details: { ko: "", en: "" }, sections: {}, role: null, period: null,
    techStack: ["React Native", "Expo", "TypeScript", "Skia"], category: "mobile", thumbnail: null, gallery: [], githubUrl: null, liveUrl: null,
    status: "unknown", featured: false, published: false, createdAt: "", updatedAt: "",
  },
  ...["SignBridge AI", "CursorBridge", "E우리"].map((title) => ({
    id: title === "E우리" ? "e-uri" : title.toLowerCase().replaceAll(" ", "-"), slug: title === "E우리" ? "e-uri" : title.toLowerCase().replaceAll(" ", "-"), title,
    description: { ko: "프로젝트 정보 확인 후 공개 예정입니다.", en: "Project information will be published after verification." },
    details: { ko: "", en: "" }, sections: {}, role: null, period: null, techStack: [], category: "other", thumbnail: null, gallery: [], githubUrl: null, liveUrl: null,
    status: "unknown" as const, featured: false, published: false, createdAt: "", updatedAt: "",
  })),
];

export async function getPublishedProjects() {
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) return seedProjects.filter((project) => project.published);
  try {
    const { db } = getFirebaseAdmin();
    const snapshot = await db.collection("projects").where("published", "==", true).orderBy("updatedAt", "desc").get();
    return snapshot.docs.map((document) => {
      const data = document.data();
      const iso = (value: unknown) => value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function" ? value.toDate().toISOString() : "";
      return { ...data, id: document.id, createdAt: iso(data.createdAt), updatedAt: iso(data.updatedAt) } as ProjectDocument;
    });
  } catch (error) {
    console.error("Unable to load published projects", error instanceof Error ? error.message : "unknown error");
    return [];
  }
}
