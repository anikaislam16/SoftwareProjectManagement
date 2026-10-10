const express = require("express");
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  deleteMemberfromProject,
  addMemberInProject,
  getProjectByMember,
  updateDeveloperControl
} = require("./kanbanBoardController/KanbanProjectController");
// Correct import
const {
  logRequestInfo,
  addBoard,
  //  showBoards,
  showBoardById,
  updateBoard,
  deleteBoard,
} = require("./kanbanBoardController/BoardController");
const {
  addCard,
  updateCardName,
  updateCardField,
  deleteCardField,
  deleteCard,
  reorderCardsInSameBoard,
  reorderCardsInDiffBoard,
  showCard,
  deleteCardFieldbyMember,
} = require("./kanbanBoardController/BoardCardController");
const {
  requireAuth,
  requireProjectMember,
} = require("../../middleware/authMiddleware");

// Every kanban route requires a logged-in session; routes that point at one
// project additionally check that the caller is a member of that project.
const kanbanMember = requireProjectMember("kanban");
router.use(logRequestInfo);
router.use(requireAuth);
///For projects
router.route("/").get(getAllProjects).post(createProject).put(getProjectByMember);  //shb project nam show. //project create  // 1ta particular member er shb project find kora hoi.
router
  .route("/:id")
  .get(kanbanMember, getProjectById) //etai project er id diye oi project er shb info pawa jabe. emn ki oi project er under e shb board er info o pawa jabe.
  .put(kanbanMember, updateProject) // project nam change
  .delete(kanbanMember, deleteProject); // delete krbe project. change dorkar.
///For Boards
router.route("/:id").post(kanbanMember, addBoard); //board add krbe. initially project id diye project khujbe. tarpore board create korbe. r oi board id project er board attribute e update kore dibe.
router
  .route("/:id/:boardId")  //id holo project er r.
  .get(kanbanMember, showBoardById) //board er 1ta id diye board shb result show krbe.
  .put(kanbanMember, updateBoard) //board er id diye board er nam update krbe.
  .delete(kanbanMember, deleteBoard); //board id diye board delete kbe.

///For Cards
router.route("/:id/:boardId").get(kanbanMember, showCard)
  .post(kanbanMember, addCard); //board id diye board e card push krbe.
router
  .route("/:id/:boardId/:cardId")
  .get(kanbanMember, showCard) //Card info pawa
  .delete(kanbanMember, deleteCard);  //board id diye board select then card delete.
router.route("/:id/:boardId/:cardId").put(kanbanMember, updateCardName); //etai card er element k update kora hoi. jdi seta array type hoi, tobe push kora hoi, element.
router
  .route("/:id/cards/reorderCards/:board1Id/:board2Id/:sourceIndex/:destinationIndex")
  .put(kanbanMember, reorderCardsInDiffBoard);
router
  .route("/:id/:boardId/cards/reorderCards/:sourceIndex/:destinationIndex")
  .put(kanbanMember, reorderCardsInSameBoard);
router.route("/:id/:boardId/:cardId/:subDocumentKey/:subDocumentId").put(kanbanMember, updateCardField) //card er moddhe array type element gula update k update kora jai. board id r card id r card er subdocument er id diye.
  .post(kanbanMember, deleteCardFieldbyMember)
  .delete(kanbanMember, deleteCardField); //card er moddhe array type element er kono member delete kora jai.
router.route("/member/member/:id/:memberId").delete(kanbanMember, deleteMemberfromProject).post(kanbanMember, addMemberInProject).put(kanbanMember, updateDeveloperControl);
router.route("/")

module.exports = router;
