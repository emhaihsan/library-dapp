import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { useState } from "react";

const slideIn = keyframes`
    0%{
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    }
    100%{
    -webkit-transform: scale(1);
    transform: scale(1);
    }
`;

const Container = styled.div`
  display: grid;
  animation: ${slideIn} 0.8 cubic-bezier(0.39, 0.575, 0.565, 1) both;
  grid-template-columns: 38% 20% 5% 37%;
  padding: 2rem 0.188rem 1.625rem 1.688rem;
  border-solid: 1px;
  border-radius: 4px;
  line-height: normal;
  transition: background 0.4s linear;
  margin-right: 1rem;
  width: 250px;
  display: inline-block;
`;

const Book = ({
  id,
  name,
  year,
  author,
  finished,
  clickBookFinished,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedYear, setEditedYear] = useState(year);
  const [editedAuthor, setEditedAuthor] = useState(author);

  const handleSave = () => {
    onEdit(id, editedName, editedYear, editedAuthor);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Container>
        <div>
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="w-full p-1 border rounded"
          />
        </div>
        <div>
          <input
            type="number"
            value={editedYear}
            onChange={(e) => setEditedYear(e.target.value)}
            className="w-full p-1 border rounded"
          />
        </div>
        <div>
          <input
            type="text"
            value={editedAuthor}
            onChange={(e) => setEditedAuthor(e.target.value)}
            className="w-full p-1 border rounded"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Simpan
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Batal
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div>{name}</div>
      <div>{year}</div>
      <div>{author}</div>
      <div className="flex flex-col gap-2">
        {finished === "false" ? (
          <button
            className="font-bold px-10 py-2 bg-[#FF7F7F] text-[#FFFFFF] rounded-lg hover:scale-105 transition duration-500 ease-in-out"
            onClick={() => clickBookFinished(id)}
          >
            Finish Book
          </button>
        ) : (
          <p className="font-bold text-[#50d71e]">Book Finished</p>
        )}
        <button
          className="font-bold px-10 py-2 bg-[#6a50aa] text-[#FFFFFF] rounded-lg hover:scale-105 transition duration-500 ease-in-out"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
      </div>
    </Container>
  );
};

Book.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  author: PropTypes.string.isRequired,
  finished: PropTypes.string.isRequired,
};

export default Book;
