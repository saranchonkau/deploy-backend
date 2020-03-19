type BuildStatus = 'IDLE' | 'IN_PROGRESS';
type ProjectEntry = {
  status: BuildStatus;
  hasWaitingBuild: boolean;
  currentBuildId: string | null;
};

const INITIAL_PROJECT_ENTRY: ProjectEntry = {
  status: 'IDLE',
  currentBuildId: null,
  hasWaitingBuild: false,
};

class ProjectBuilder {
  map: Map<string, ProjectEntry>;

  constructor() {
    this.map = new Map();
  }

  getProjectEntry(projectName: string) {
    let projectEntry = this.map.get(projectName);

    if (!projectEntry) {
      projectEntry = INITIAL_PROJECT_ENTRY;
      this.map.set(projectName, projectEntry);
    }

    return projectEntry;
  }

  build(projectName: string) {
    const project = this.getProjectEntry(projectName);
    if (project.hasWaitingBuild) {
      return;
    }
  }

  updateStatus(project: string, status: BuildStatus) {
    const entry = this.map.get(project);
    // const nextStatus =
    // this.map.set(project, { status: ,  });
  }
}

const projectBuilder = new ProjectBuilder();

export default projectBuilder;
