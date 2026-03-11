import type { Project, FileNode } from "@/types/pdm";

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Turbine Assembly",
    description: "Gas turbine main assembly and sub-components",
    owner: "admin@company.com",
    createdAt: "2026-01-15",
    folderPath: "/pdm_projects/turbine_assembly",
    memberCount: 4,
  },
  {
    id: "2",
    name: "Hydraulic Valve Block",
    description: "Hydraulic manifold valve block redesign",
    owner: "admin@company.com",
    createdAt: "2026-02-01",
    folderPath: "/pdm_projects/hydraulic_valve_block",
    memberCount: 2,
  },
  {
    id: "3",
    name: "Chassis Frame v2",
    description: "Updated chassis frame for EV platform",
    owner: "admin@company.com",
    createdAt: "2026-02-20",
    folderPath: "/pdm_projects/chassis_frame_v2",
    memberCount: 6,
  },
];

export const mockFileTree: FileNode[] = [
  {
    name: "Assembly",
    type: "folder",
    path: "/Assembly",
    children: [
      { name: "main_assembly.sldasm", type: "file", size: 24500000, lastModified: "2026-02-25", extension: ".sldasm", path: "/Assembly/main_assembly.sldasm" },
      { name: "sub_frame.sldprt", type: "file", size: 8200000, lastModified: "2026-02-24", extension: ".sldprt", path: "/Assembly/sub_frame.sldprt" },
      { name: "bracket_01.step", type: "file", size: 3100000, lastModified: "2026-02-20", extension: ".step", path: "/Assembly/bracket_01.step" },
    ],
  },
  {
    name: "Parts",
    type: "folder",
    path: "/Parts",
    children: [
      { name: "shaft.stp", type: "file", size: 5600000, lastModified: "2026-02-22", extension: ".stp", path: "/Parts/shaft.stp" },
      { name: "bearing_housing.stl", type: "file", size: 12300000, lastModified: "2026-02-18", extension: ".stl", path: "/Parts/bearing_housing.stl" },
      { name: "gasket.ipt", type: "file", size: 1200000, lastModified: "2026-02-15", extension: ".ipt", path: "/Parts/gasket.ipt" },
    ],
  },
  {
    name: "Documentation",
    type: "folder",
    path: "/Documentation",
    children: [
      { name: "BOM.xlsx", type: "file", size: 45000, lastModified: "2026-02-26", extension: ".xlsx", path: "/Documentation/BOM.xlsx" },
      { name: "assembly_drawing.pdf", type: "file", size: 2800000, lastModified: "2026-02-25", extension: ".pdf", path: "/Documentation/assembly_drawing.pdf" },
      { name: "specs.docx", type: "file", size: 120000, lastModified: "2026-02-10", extension: ".docx", path: "/Documentation/specs.docx" },
    ],
  },
];
