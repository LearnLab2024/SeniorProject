import React, { useState, useContext } from 'react'; 
import UserHeader from '../components/UserHeader';
import AuthContext from '../contexts/AuthContext';

const Profile = () => {
    const { signOut, user } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Set the image as a preview
      };
      reader.readAsDataURL(file); // Convert file to base64 string for image preview
    }
  };

  return (
    <div className="min-h-screen w-full bg-primary flex flex-col items-center">
      <UserHeader />
  
      <div className='bg-primary p-20 rounded-lg w-full max-w-md mt-8 flex flex-col items-center'>
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Profile Preview"
            className="w-40 h-40 object-cover rounded-full mb-4"
          />
        ) : (
          <label htmlFor="file-input" className="w-40 h-40 bg-gray-300 rounded-full mb-4 flex items-center justify-center text-gray-500 cursor-pointer">
            <span className="text-4xl font-bold">+</span>
          </label>
        )}
  
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
  
        <p 
          className="w-full mt-6 px-3 py-2 bg-white text-black font-pregular rounded-full border-2 border-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:outline-4" 
          title={user?.signInDetails?.loginId}
        >
          {user?.signInDetails?.loginId}
        </p>

        <button
          onClick={handleSignOut}
          className="w-40 mx-8 py-2 mt-8 bg-gradient-to-r from-button-from to-button-to text-black font-psemibold border-2 border-secondary rounded-full hover:opacity-90 transition duration-300 flex items-center justify-center"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
  
};

export default Profile;

