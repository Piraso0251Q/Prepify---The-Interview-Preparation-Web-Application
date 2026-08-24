import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Search, ShieldCheck, X, Check } from "lucide-react";
import { QUESTIONS as INITIAL_QUESTIONS, ROLES, ALL_TOPICS, DIFFICULTIES } from "../../data/questions";
import { DifficultyBadge, TopicBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input, Textarea, Select } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../../components/ui/Toast";
import "./AdminPortalPage.css";

const EMPTY_FORM = { title: "", description: "", role: "Frontend", topic: "React", difficulty: "Easy", modelAnswer: "", explanation: "", keywords: "" };

export default function AdminPortalPage() {
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterDiff, setFilterDiff] = useState("");
  const [modal, setModal] = useState(null); // null | { mode: 'add'|'edit'|'delete', question? }
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const { toasts, addToast, removeToast } = useToast();

  const filtered = useMemo(() => questions.filter(q => {
    if (filterRole && q.role !== filterRole) return false;
    if (filterDiff && q.difficulty !== filterDiff) return false;
    if (search) {
      const s = search.toLowerCase();
      return q.title.toLowerCase().includes(s) || q.topic.toLowerCase().includes(s);
    }
    return true;
  }), [questions, search, filterRole, filterDiff]);

  const openAdd = () => { setForm(EMPTY_FORM); setFormErrors({}); setModal({ mode: "add" }); };
  const openEdit = (q) => {
    setForm({ ...q, keywords: q.keywords?.join(", ") || "" });
    setFormErrors({});
    setModal({ mode: "edit", question: q });
  };
  const openDelete = (q) => setModal({ mode: "delete", question: q });
  const closeModal = () => setModal(null);

  const setField = (k) => (e) => { setForm(p => ({ ...p, [k]: e.target.value })); setFormErrors(p => ({ ...p, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = "Required";
    if (!form.modelAnswer.trim()) e.modelAnswer = "Required";
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }

    const payload = {
      ...form,
      id: modal.mode === "add" ? `custom-${Date.now()}` : modal.question.id,
      keywords: form.keywords.split(",").map(k => k.trim()).filter(Boolean),
      bookmarked: false,
    };

    if (modal.mode === "add") {
      setQuestions(p => [...p, payload]);
      addToast("Question added successfully!", "success");
    } else {
      setQuestions(p => p.map(q => q.id === payload.id ? payload : q));
      addToast("Question updated successfully!", "success");
    }
    closeModal();
  };

  const handleDelete = () => {
    setQuestions(p => p.filter(q => q.id !== modal.question.id));
    addToast("Question deleted.", "info");
    closeModal();
  };

  const ROLE_OPTIONS = ROLES.map(r => ({ value: r, label: r }));
  const TOPIC_OPTIONS = ALL_TOPICS.map(t => ({ value: t, label: t }));
  const DIFF_OPTIONS  = DIFFICULTIES.map(d => ({ value: d, label: d }));

  return (
    <div className="admin page-enter">
      <div className="admin-header">
        <div className="admin-title-wrap">
          <ShieldCheck size={22} className="admin-icon" />
          <div>
            <h1 className="admin-title">Admin Portal</h1>
            <p className="admin-subtitle">Manage the question bank ({questions.length} questions)</p>
          </div>
        </div>
        <Button icon={<Plus size={16} />} onClick={openAdd}>Add Question</Button>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="admin-search-wrap">
          <Search size={15} className="admin-search-icon" />
          <input className="admin-search" placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="admin-select" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select className="admin-select" value={filterDiff} onChange={e => setFilterDiff(e.target.value)}>
          <option value="">All Difficulties</option>
          {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Role</th>
              <th>Topic</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(q => (
              <tr key={q.id} className="admin-row">
                <td className="admin-td-question">
                  <p className="admin-question-title">{q.title}</p>
                </td>
                <td><span className="admin-role">{q.role}</span></td>
                <td><TopicBadge topic={q.topic} /></td>
                <td><DifficultyBadge difficulty={q.difficulty} /></td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-action-btn edit" onClick={() => openEdit(q)} aria-label="Edit question">
                      <Pencil size={15} />
                    </button>
                    <button className="admin-action-btn delete" onClick={() => openDelete(q)} aria-label="Delete question">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="admin-empty">No questions match your filters.</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <Modal
          isOpen
          onClose={closeModal}
          title={modal.mode === "add" ? "Add New Question" : "Edit Question"}
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button onClick={handleSave} icon={<Check size={15} />}>
                {modal.mode === "add" ? "Add Question" : "Save Changes"}
              </Button>
            </>
          }
        >
          <div className="admin-form">
            <Input label="Question Title" value={form.title} onChange={setField("title")} error={formErrors.title} required placeholder="e.g. What is the Virtual DOM?" />
            <Textarea label="Question Description" value={form.description} onChange={setField("description")} rows={3} placeholder="Detailed question description..." />
            <div className="admin-form-row">
              <Select label="Role" value={form.role} onChange={setField("role")} options={ROLE_OPTIONS} />
              <Select label="Topic" value={form.topic} onChange={setField("topic")} options={TOPIC_OPTIONS} />
              <Select label="Difficulty" value={form.difficulty} onChange={setField("difficulty")} options={DIFF_OPTIONS} />
            </div>
            <Textarea label="Model Answer" value={form.modelAnswer} onChange={setField("modelAnswer")} error={formErrors.modelAnswer} rows={5} required placeholder="The ideal answer to this question..." />
            <Textarea label="Explanation" value={form.explanation} onChange={setField("explanation")} rows={3} placeholder="Why this answer matters..." />
            <Input label="Keywords (comma-separated)" value={form.keywords} onChange={setField("keywords")} placeholder="e.g. Virtual DOM, reconciliation, diffing" />
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {modal?.mode === "delete" && (
        <Modal
          isOpen
          onClose={closeModal}
          title="Delete Question"
          size="sm"
          footer={
            <>
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete} icon={<Trash2 size={15} />}>Delete</Button>
            </>
          }
        >
          <div className="delete-modal-body">
            <div className="delete-modal-icon"><Trash2 size={36} /></div>
            <p>Are you sure you want to delete this question?</p>
            <p className="delete-modal-qname">"{modal.question.title}"</p>
            <p className="delete-modal-warning">This action cannot be undone.</p>
          </div>
        </Modal>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
