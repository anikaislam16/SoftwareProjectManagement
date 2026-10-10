const { Member } = require("../modules/MemberModule");
const { ScrumProject } = require("../modules/ScrumModule");
const { KanbanProject } = require("../modules/KanbanModule");
const DailyScrum = require("../modules/ScrumReviewModule");

// Reads the logged-in user from the session (identified by the browser
// cookie), loads the matching Member document and attaches it to req.member.
// Requests without a valid session are rejected with 401.
// Works for both login methods: email/password (req.session.user) and
// Google (req.session.passport.user).
const requireAuth = async (req, res, next) => {
  try {
    const sessionUser =
      (req.session && req.session.user) ||
      (req.session && req.session.passport && req.session.passport.user);

    if (!sessionUser || !sessionUser.email) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const member = await Member.findOne({ email: sessionUser.email });
    if (!member) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    req.member = member;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Loads the project the request points at and checks that req.member is in
// its members list. On success req.project and req.memberRole are set, so
// controllers can also do role-specific checks when needed.
// The project id is taken from req.params.id, req.params.projectId or
// req.body.projectId - whichever the route provides.
const requireProjectMember = (projectType) => async (req, res, next) => {
  try {
    const projectId =
      req.params.projectId || req.params.id || req.body.projectId;

    if (!projectId) {
      return res.status(400).json({ message: "Project id is required" });
    }

    const ProjectModel =
      projectType === "kanban" ? KanbanProject : ScrumProject;
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const memberEntry = project.members.find(
      (m) => m.member_id.toString() === req.member._id.toString()
    );
    if (!memberEntry) {
      return res.status(403).json({ message: "Not a member of this project" });
    }

    req.project = project;
    req.memberRole = memberEntry.role;
    next();
  } catch (error) {
    console.error("Project member check error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// For PUT /DailyScrum/:id the id belongs to the DailyScrum document, so the
// project has to be resolved through it before the membership check can run.
const requireDailyScrumMember = [
  requireAuth,
  async (req, res, next) => {
    try {
      const dailyScrum = await DailyScrum.findById(req.params.id);
      if (!dailyScrum || !dailyScrum.projectId) {
        return res.status(404).json({ message: "Daily scrum not found" });
      }
      req.params.projectId = dailyScrum.projectId.toString();
      next();
    } catch (error) {
      console.error("Daily scrum lookup error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  requireProjectMember("scrum"),
];

module.exports = { requireAuth, requireProjectMember, requireDailyScrumMember };
