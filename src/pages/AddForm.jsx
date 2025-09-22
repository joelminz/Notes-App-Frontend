import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { notesService } from "../services/authService";
import 'animate.css/animate.min.css';

export default function AddForm() {
    const [note, setNote] = useState({
        title: "",
        details: "",
    });

    const changeHandler = (event) => {
      const { name, value} = event.target;
      setNote( {...note, [name]: value});
    };

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
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
        const response = await notesService.addNote(note);
        
        if (response.success) {
          Swal.fire({
            title: 'Success!',
            text: response.msg,
            icon: 'success',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Add note error:', error);
        Swal.fire({
          title: 'Error!',
          text: error.message || 'Failed to add note',
          icon: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    return (
        <div>
            <h1 className="headline">
                Add <span>Note</span>
            </h1>
            <form className="note-form">
                <input
                    type="text"
                    name="title"
                    value={note.title}
                    onChange={changeHandler}
                    placeholder="Title of Note ..."
                    required
                />
                <textarea
                    name="details"
                    rows="5"
                    value={note.details}
                    onChange={changeHandler}
                    placeholder="Describe Your Note ..."
                    required
                ></textarea>
                <button type="submit" onClick={submitHandler} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Note'}
                </button>
            </form>
        </div>
    );
}
