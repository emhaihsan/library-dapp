"use client";
import { Container } from "./styles";
import PropTypes from "prop-types";
import { useState } from "react";

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
      <Container className="space-y-4">
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a50aa]"
        />
        <input
          type="number"
          value={editedYear}
          onChange={(e) => setEditedYear(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a50aa]"
        />
        <input
          type="text"
          value={editedAuthor}
          onChange={(e) => setEditedAuthor(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a50aa]"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h3 className="text-xl font-bold mb-2 text-[#6a50aa]">{name}</h3>
      <div className="text-gray-600 mb-4">
        <p>Year: {year}</p>
        <p>Author: {author}</p>
      </div>
      <div className="space-y-2">
        {finished === "false" ? (
          <button
            className="w-full py-2 bg-[#FF7F7F] text-white rounded-lg hover:bg-[#ff6666] transition duration-300"
            onClick={() => clickBookFinished(id)}
          >
            Finish Book
          </button>
        ) : (
          <p className="text-green-500 font-bold text-center py-2">
            ✓ Finished
          </p>
        )}
        <button
          className="w-full py-2 bg-[#6a50aa] text-white rounded-lg hover:bg-[#553d8c] transition duration-300"
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
