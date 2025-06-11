# Dim Tvaryn - Backend

The backend for the **Dim Tvaryn** online platform, designed to help animals find new owners. The platform allows users to create and view animal adoption listings and provides seamless interaction between users.

## 🚀 Project Goal

To create a user-friendly and efficient online platform that helps animals find new homes.

## 🛠 Tech Stack

- **Node.js** – JavaScript framework for backend development.  
- **Express.js** – A web framework for Node.js.  
- **MongoDB** – A database for storing information.  

## 🌍 Deployment & Documentation

- **Backend deployed on Render:**  
  [https://marketplace-backend-wrk2.onrender.com](https://marketplace-backend-wrk2.onrender.com)  
- **Swagger API Documentation:**  
  [https://marketplace-backend-wrk2.onrender.com/api-docs/](https://marketplace-backend-wrk2.onrender.com/api-docs/)  
- **Dim Tvaryn Organization Repository:**  
  [https://github.com/orgs/Dim-Tvaryn/repositories](https://github.com/orgs/Dim-Tvaryn/repositories)  
- **Figma Design Mockup:**  
  [https://www.figma.com/design/EGid5p8wkxaLKjidPmeO6b/DimTvaryn?node-id=129-636&t=g511edTVlzHEYcfT-0](https://www.figma.com/design/EGid5p8wkxaLKjidPmeO6b/DimTvaryn?node-id=129-636&t=g511edTVlzHEYcfT-0)  

## 📌 Implemented Features

✔ **User Authentication & Management**  
- User registration  
- Email verification  
- Login  
- Retrieve and update user data  
- Password recovery and change  
- Account deletion  
- Logout  

✔ **Automated Email Services**  
- Email verification upon registration  
- Password reset and update
- Sending user feedback to the app team
- Replying to user feedback via automated response

✔ **Image Upload & Optimization**  
- **Multer** for file uploads  
- **Cloudinary** integration for storage and optimization  

✔ **Animal Listings**  
- Creation of animal adoption listings (for authorized users)  
- Display of all active listings on the homepage
- View animal details
- Edit and delete animal listings (by listing owner)
- Add or remove animals from favorites
- Filter animals by selected categories (type, gender, age, breed, location, size, date added)

✔ **Automatic Traits Integration Based on Animal Type and Breed**
- On animal creation or update, size, weight, and coat are auto-filled based on animalType and breed using the static animalTraits collection.
- Works for valid types (dogs, cats, birds) and existing breeds listed in animalTraits.
- If no match is found, traits are simply not added — no error is thrown.
  
## 📥 Installation & Setup

### Clone the Repository

1. Clone the repository:

   ```bash
   git clone https://github.com/artem-yaremchuk/marketplace-backend.git

2. Navigate to the project directory:

   ```bash
   cd marketplace-backend

   ```

3. Install dependencies:

   ```bash
   npm install

   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
## 👥 Author

This project was developed following best practices in backend development.  
**Author:** [Artem Yaremchuk](https://github.com/Artem-Yaremchuk).
