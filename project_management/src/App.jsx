import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProjectKanban from "../src/components/project/kanban/ProjectKanban";
import "./App.css";
import Home from "./components/home/Home";
import Navbar1 from "./components/navbar/Navbar1";
import Gantt1 from "./components/project/kanban/GranttChart/Gantt1.jsx";
import Members from "./components/project/kanban/Member/Members";
import BoardMain from "./components/project/kanban/board/BoardMain";
import ProjectScrum from "./components/project/scrum/ProjectScrum";
import GanttScrum from "./components/project/scrum/gantt/GanttScrum";
import ScrumBoardMain from "./components/project/scrum/board/ScrumBoardMain";
import MemberScrum from "./components/project/scrum/member/Members";
import SprintBoardMain from "./components/project/scrum/sprint/SprintBoardMain";
import Forgetpass from "./components/Login/Forgetpass.jsx";
import OTPpass from "./components/Login/OTPpass.jsx";
import Temp from "./components/Login/Temp.jsx";
import Signup from "./components/signup/signup.jsx";
import OTP from "./components/signup/OTP.jsx";
import Login from "./components/Login/Login.jsx";
import Password from "./components/signup/Password.jsx";
import UpdatePass from "./components/Login/UpdatePass.jsx";
import ChartExample from "./components/project/scrum/reports/ChartExample.jsx";
import ControlChart from "./components/project/kanban/Report/ControlChart/ControlChart.jsx";
import RecentIssue from "./components/project/kanban/Report/RecentlyCreaedIssue/RecentIssue.jsx";
import PieChartKanban from "./components/project/kanban/Report/PieChart/PieChart.jsx";
import ResolutionTime from "./components/project/kanban/Report/ResolutionTime/ResolutionTime.jsx";
import ScrumCompleteBoardMain from "./components/project/scrum/completeBoard/ScrumCompleteBoardMain.jsx";
import BurnDown from "./components/project/scrum/reports/BurnDown.jsx";
import PieChart from "./components/project/scrum/reports/PieChart.jsx";
import SprintReport from "./components/project/scrum/reports/SprintReport.jsx";
import GraphScrum from "./components/project/scrum/reports/GraphScrum";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar1 />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/otp" element={<OTP />} />
          <Route path="/signup/password" element={<Password />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<Forgetpass />}>
            <Route path="otp" element={<OTPpass />} />
          </Route>
          <Route path="/Updatepass" element={<UpdatePass />} />
          <Route path="/login/temp" element={<Temp />} />

          <Route path="/project/kanban/:projectId/" element={<ProjectKanban />}>
            <Route path="gantt" element={<Gantt1 />} />
            <Route path="members" element={<Members />} />
            <Route index element={<BoardMain />} />
            <Route path="piechart" element={<PieChartKanban />} />
            <Route path="controlchart" element={< ControlChart />} />
            <Route path="recentcretedchart" element={<RecentIssue />} />
            <Route path="resolutionchart" element={<ResolutionTime />} />
          </Route>
          <Route path="/project/scrum/:projectId/" element={<ProjectScrum />}>
            <Route path="gantt" element={<GanttScrum />}></Route>
            <Route
              path="completed"
              element={<ScrumCompleteBoardMain />}
            ></Route>
            <Route path="members" element={<MemberScrum />} />
            <Route index element={<SprintBoardMain />} />
            <Route path="board" element={<ScrumBoardMain />} />
            <Route path="velocity" element={<GraphScrum />} />
            <Route path="burn" element={<BurnDown />} />
            <Route path="report" element={<SprintReport />} />
            <Route path="pie" element={<PieChart />} />
            {/* <Route path="graph" element={<Graph />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;