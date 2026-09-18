# System Architecture

The application is a two-tier web system — a **React SPA** (`project_management/`, port 3000) talking to a **Node.js/Express REST + WebSocket API** (`api/`, port 3010) — over **MongoDB**. Logically it is organized into four layers: Presentation, Application/API, Data Access, and Data. The diagram below shows the **actual implemented technologies, modules, and collections** of this repository, not generic component names.

```mermaid
flowchart TB

    %% ================= PRESENTATION LAYER =================
    subgraph PL["<b>PRESENTATION LAYER</b><br/>React 18.2 SPA · Create React App 5 · React Router 6 · Bootstrap 5 — localhost:3000"]
        direction LR
        LOGIN["Login / Sign-up<br/><i>Email + OTP · Google OAuth</i>"]
        DASH["Dashboard / Home<br/><i>Project chooser · Profile</i>"]
        SCRUM["Scrum Board<br/><i>Backlog · Sprint Board ·<br/>Daily Scrum / Sprint Review</i>"]
        KANBAN["Kanban Board<br/><i>drag-and-drop<br/>react-beautiful-dnd</i>"]
        TDDI["TDD Interface<br/><i>Requirements → Test Design → Test Plan</i>"]
        ISSUEUI["Live Issue Board<br/><i>Chat UI · socket.io-client 4.7</i>"]
        REPORTS["Reports — computed client-side<br/><i>Recharts · ApexCharts · D3 · Gantt</i><br/>Burndown · Velocity · Control Chart ·<br/>Pie · Resolution Time"]
    end

    %% ================= APPLICATION / API LAYER =================
    subgraph AL["<b>APPLICATION / API LAYER</b><br/>Node.js · Express 4.18 · Socket.IO 4.7 — localhost:3010"]
        direction LR
        AUTH["Authentication Service<br/><i>/signup routes</i><br/>express-session (connect.sid)<br/>bcryptjs · Passport Google OAuth2<br/>Nodemailer OTP e-mail"]
        RBAC["Role-Based Authorization<br/>per-project member roles<br/>Admin · Scrum Master ·<br/>Product Owner · Developer<br/>(drag enable / disable)"]
        PROJM["Project Management Service<br/><i>/projects/kanban · /projects/scrum</i><br/>KanbanProject + ScrumProject<br/>controllers · member e-mail alerts"]
        TASKS["Task / Sprint Management Service<br/><i>Board + Card controllers</i><br/>backlog / sprint boards · tasks · tags<br/>reorder · sprint rollover<br/>Daily Scrum + Sprint Review docs"]
        TDDS["TDD Management Service<br/><i>/test/scrum · /test/kanban</i><br/>TestCase controller<br/>status: refactor → passed / failed"]
        LIVE["Live Issue Board Service<br/><i>/message routes</i><br/>Chat + Message controllers<br/>realtime relay + e-mail notifications"]
        FILES["File Upload Service<br/><i>/pdf routes</i><br/>Multer · upload / download"]
    end

    %% ================= DATA ACCESS LAYER =================
    subgraph DAL["<b>DATA ACCESS LAYER</b><br/>Mongoose 8.0 ODM — api/modules/"]
        direction LR
        MODELS["Mongoose Schemas (10 models)<br/>Member · KanbanProject · KanbanBoard<br/>ScrumProject · ScrumBoard · DailyScrum<br/>TestCase · Question · Message · PDF"]
        GRID["Multer disk storage<br/>api/uploads/"]
    end

    %% ================= DATA LAYER =================
    subgraph DL["<b>DATA LAYER</b><br/>MongoDB 7.0 · db: student — localhost:27017"]
        direction LR
        C_MEM["members<br/><i>users · bcrypt password hashes</i>"]
        C_PROJ["kanbanprojects · scrumprojects<br/><i>embedded members[ ].role<br/>(roles / permissions)</i>"]
        C_BOARD["kanbanboards · scrumboards<br/><i>embedded cards[ ] · task[ ] subtasks<br/>tags · dependencies · sprint fields</i>"]
        C_DS["dailyscrums<br/><i>daily scrum · sprint review records</i>"]
        C_TEST["testcases<br/><i>TDD test cases per task</i>"]
        C_QA["questions · messages<br/><i>issue-board posts · replies</i>"]
        C_PDF["pdfs<br/><i>file metadata → api/uploads/</i>"]
    end

    %% ================= FLOWS =================
    PL -->|"REST / JSON — fetch( ) · session cookie"| AL
    ISSUEUI <-.->|"WebSocket — Socket.IO 4.7"| LIVE
    AL --> DAL
    DAL --> DL

    %% ================= STYLING =================
    classDef presentation fill:#E8F0FE,stroke:#4285F4,stroke-width:1.5px
    classDef application fill:#FEF7E0,stroke:#F9AB00,stroke-width:1.5px
    classDef dataaccess fill:#E6F4EA,stroke:#34A853,stroke-width:1.5px
    classDef data fill:#FCE8E6,stroke:#EA4335,stroke-width:1.5px

    class LOGIN,DASH,SCRUM,KANBAN,TDDI,ISSUEUI,REPORTS presentation
    class AUTH,RBAC,PROJM,TASKS,TDDS,LIVE,FILES application
    class MODELS,GRID dataaccess
    class C_MEM,C_PROJ,C_BOARD,C_DS,C_TEST,C_QA,C_PDF data
```

## Layer-by-Layer Technology Map

| Layer | Component | Technology / Version | Code Location |
|---|---|---|---|
| Presentation | SPA framework | React 18.2 · Create React App (react-scripts) 5.0.1 | `project_management/src/` |
| Presentation | Routing / UI | React Router DOM 6.21 · Bootstrap 5.3 · react-bootstrap 2.9 | `project_management/src/App.jsx` |
| Presentation | Kanban drag-and-drop | react-beautiful-dnd 13.1 | `src/components/project/kanban/board/` |
| Presentation | Reports (client-side) | Recharts 2.11 · ApexCharts 3.45 · D3 7.8 · gantt-task-react / frappe-gantt | `src/components/project/*/reports/`, `Report/` |
| Presentation | Rich text (daily scrum) | Jodit React 4.0 | `src/components/project/scrum/scrum_review/` |
| Presentation | Realtime client | socket.io-client 4.7.5 | `src/components/project/kanban/Chatting/` |
| Presentation ↔ API | HTTP transport | native `fetch` with `credentials: include` (no axios) | throughout components |
| Application / API | HTTP framework | Node.js · Express 4.18.2 (port 3010) | `api/index.js` |
| Application / API | Authentication | express-session 1.17 (`connect.sid` cookie) · bcryptjs 2.4 · Passport 0.7 + passport-google-oauth2 · Nodemailer 6.9 (OTP) | `api/routes/memberRoute/Signup/` |
| Application / API | Authorization | per-project role strings (`members[].role`) + role lookup endpoint; Kanban `drag` enable/disable | `KanbanProjectController.js`, `findmemberbyId.js` |
| Application / API | Project management | `/projects/kanban`, `/projects/scrum` route modules | `api/routes/kanbanRoute/`, `api/routes/scrumRoute/` |
| Application / API | Task / sprint management | Board, Card, Sprint, and Review controllers (embedded subdocuments, reorder, sprint rollover) | `api/routes/*/` — `BoardController.js`, `ScrumBoardCardController.js`, `ScrumReviewController.js` |
| Application / API | TDD management | `/test/scrum`, `/test/kanban` — test cases per task with status lifecycle | `api/routes/testRoute/TestRoute.js` |
| Application / API | Live issue board | `/message` routes + Socket.IO 4.7.5 realtime relay + e-mail notifications | `api/routes/messageRoute/`, `api/index.js` (io) |
| Application / API | File upload | Multer 1.4 disk storage → `api/uploads/` | `api/routes/pdfRoutes/pdfRoutes.js` |
| Data Access | ODM | Mongoose 8.0.3 — 10 schema models | `api/modules/*.js` |
| Data | Database | MongoDB 7.0 (Community), db `student` @ localhost:27017 | connection in `api/server.js` |
| Data | Collections | `members`, `kanbanprojects`, `scrumprojects`, `kanbanboards`, `scrumboards`, `dailyscrums`, `testcases`, `questions`, `messages`, `pdfs` | auto-pluralized by Mongoose |
| Data | File store | `api/uploads/` on disk (PDFs referenced from cards) | `api/uploads/` |

## Implementation Notes

- **Reporting has no backend service.** Burndown, velocity, control-chart, pie, resolution-time, and Gantt reports are computed in the React layer from board/sprint REST data — hence "Reports" sits in the Presentation Layer, and there is no report collection in the database (report *source* records are the sprint boards and `dailyscrums`).
- **Denormalized document model.** Tasks/subtasks, tags, and card members are embedded subdocuments inside board documents (`cards[].task[]`), not separate collections; likewise roles/permissions live inside each project's `members[]` array rather than a dedicated roles collection.
- **Two authentication paths.** Email + password (bcrypt) with OTP e-mail verification, and Google OAuth2 — both resolve to an `express-session` server-side session.
- **Hybrid transport.** All persistence goes through REST; Socket.IO is used only to broadcast live issue-board messages/edits to other participants in real time.
