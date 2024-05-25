// App.js

import React, {
  useState,
  useEffect
  } from 'react';
  import axios from 'axios';
  import './index.css';
  
  function App() {
  const [showPosts, setShowPosts] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newContent, setNewContent] = useState({
    title: '', description: '', allowComment: true
  });
  const [editContent, setEditContent] = useState(null);
  
  useEffect(() => {
    // Fetch content from the server when the component mounts
    axios.get('http://localhost:5000/cms')
    .then(response => setPosts(response.data))
    .catch(error =>
      console.error('Error fetching content:', error));
  }, []); // Empty dependency array ensures the effect runs only once
  
  const handleDashboardClick = () => {
    // Reset the state to initial values
    setShowPosts(false);
    setPosts([]);
  };
  
  const handlePostsClick = () => {
    // Fetch posts from the server when the "Posts" button is clicked
    axios.get('http://localhost:5000/cms')
    .then(response => {
      setPosts(response.data);
      setShowPosts(true);
    })
    .catch(error =>
      console.error('Error fetching posts:', error));
  };
  
  const handleApprove = (id) => {
    // Approve post on the server
    axios.post(`http://localhost:5000/cms/approve/${id}`)
    .then(response => {
      console.log(response.data);
      // Update the local state to reflect the change
      setPosts(prevPosts =>
      prevPosts.map(post => post.id === id ?
        { ...post, status: 'approved' } : post));
    })
    .catch(error =>
      console.error('Error approving post:', error));
  };
  
  const handleEdit = (post) => {
    // Set the post to be edited in the state
    setEditContent(post);
  };
  
  const handleSaveEdit = () => {
    // Save the edited content on the server
    axios.put(`http://localhost:5000/cms/edit/${editContent.id}`,
    editContent)
    .then(response => {
      console.log(response.data);
      // Update the local state to reflect the change
      setPosts(prevPosts =>
      prevPosts.map(post => post.id === editContent.id ?
        { ...post, ...editContent } : post));
      // Reset the editContent state
      setEditContent(null);
    })
    .catch(error =>
      console.error('Error saving edit:', error));
  };
  
  const handleCancelEdit = () => {
    // Reset the editContent state
    setEditContent(null);
  };
  
  const handleInputChange = (e) => {
    // Update the newContent state when input changes
    setNewContent({
    ...newContent,
    [e.target.name]: e.target.value
    });
  };
  
  const handleAddContent = () => {
    // Add new content on the server
    axios.post('http://localhost:5000/cms', newContent)
    .then(response => {
      console.log(response.data);
      // Update the local state to reflect the change
      setPosts(prevPosts =>
      [...prevPosts, {
        ...newContent, status: 'pending',
        id: response.data.id
      }]);
      // Reset the newContent state
      setNewContent({
      title: '',
      description: '',
      allowComment: true
      });
    })
    .catch(error =>
      console.error('Error adding content:', error));
  };
  
  const handleInputChangeEdit = (e) => {
    // Update the editContent state when input changes
    setEditContent({
    ...editContent,
    [e.target.name]: e.target.type === 'checkbox' ?
      e.target.checked : e.target.value
    });
  };
  
  return (
    <div>
    {/* Navigation Bar */}
    <nav>
      <div>Content Management System</div>
    </nav>
  
    {/* Hero Section */}
    <div className="hero-section">
      {/* Left Part */}
      <div className="left-part">
      <h2>Admin Panel</h2>
      <button onClick={handleDashboardClick}>
        Dashboard
      </button><br /><br />
      <button onClick={handlePostsClick}>
        Posts
      </button>
      </div>
  
      {/* Right Part */}
      <div className="right-part">
      {showPosts ? (
        <div>
        <h3>Posts</h3>
        <table>
          <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Allow Comment</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {posts.map(post => (
            <tr key={post.id}>
            <td>{post.title}</td>
            <td>{post.description}</td>
            <td>{post.status}</td>
            <td>{post.allowComment ? 'Yes' : 'No'}</td>
            <td>
              {post.status === 'pending' && (
              <>
                <button
                onClick={() => handleApprove(post.id)}>
                Approve
                </button>
                <button
                onClick={() => handleEdit(post)}>
                Edit
                </button>
              </>
              )}
            </td>
            </tr>
          ))}
          </tbody>
        </table>
        </div>
      ) : (
        <p>Click on "Posts" to view content.</p>
      )}
  
      {/* Form for Adding New Content */}
      <h3>Add New Content</h3>
      <form>
        <label>
        Title:
        <input type="text" name="title"
          value={newContent.title}
          onChange={handleInputChange} />
        </label>
        <br />
        <label>
        Description:
        <textarea name="description"
          value={newContent.description}
          onChange={handleInputChange} />
        </label>
        <br />
        <label>
        Allow Comment:
        <select name="allowComment"
          value={newContent.allowComment}
          onChange={handleInputChange}>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
        </label>
        <br />
        <button type="button"
        onClick={handleAddContent}>
        Add Content
        </button>
      </form>
  
      {/* Form for Editing Content */}
      {editContent && (
        <>
        <h3>Edit Content</h3>
        <form>
          <label>
          Title:
          <input type="text" name="title"
            value={editContent.title}
            onChange={handleInputChangeEdit} />
          </label>
          <br />
          <label>
          Description:
          <textarea name="description"
            value={editContent.description}
            onChange={handleInputChangeEdit} />
          </label>
          <br />
          <label>
          Allow Comment:
          <select name="allowComment"
            value={editContent.allowComment}
            onChange={handleInputChangeEdit}>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
          </label>
          <br />
          <button type="button"
          onClick={handleSaveEdit}>
          Save
          </button>
          <button type="button"
          onClick={handleCancelEdit}>
          Cancel
          </button>
        </form>
        </>
      )}
      </div>
    </div>
    </div>
  );
  }
  export default App;
  