import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { notesService } from "../services/authService";
import Swal from "sweetalert2";

export default function EditForm() {
    const { id } = useParams();
    const [note, setNote] = useState({
        title: '',
        details: '',
    });
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await notesService.getNote(id);
                if (response.success) {
                    setNote(response.content);
                }
            } catch (error) {
                console.error('Error fetching note:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to load note',
                    icon: 'error'
                });
            }
        };
        fetchNote();
    }, [id]);
    
    const changeHandler = (event) => {
        const {name, value} = event.target;
        setNote({ ...note, [name]: value });
    }

    const navigate = useNavigate();
    const submitHandler = async (event) => {
        event.preventDefault();
        
        if (!note.title.trim() || !note.details.trim()) {
            Swal.fire({
                title: 'Error!',
                text: 'Please fill in both title and details',
                icon: 'error'
            });
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await notesService.updateNote(id, note);
            if (response.success) {
                Swal.fire({
                    title: 'Success!',
                    text: response.msg,
                    icon: 'success'
                });
                navigate(`/details/${id}`);
            }
        } catch (error) {
            console.error('Update note error:', error);
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to update note',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    }
  return (
    <div>
            <h1 className="headline">
                Edit <span>Note</span>
            </h1>
            <form className="note-form">
                <input
                    type="text"
                    name="title"
                    value={note.title}
                    onChange={changeHandler}
                    placeholder="Title of Note ..."
                />
                <textarea
                    name="details"
                    rows="5"
                    value={note.details}
                    onChange={changeHandler}
                    placeholder="Describe Your Note ..."
                ></textarea>
                <button onClick={submitHandler} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
  )
}
