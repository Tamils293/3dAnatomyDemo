# 3D Anatomy Demo

Welcome to the 3D Anatomy Demo repository! This Vite app showcases a 3D anatomy model and allows you to mark positions on the model based on uploaded coordinates.

## Getting Started

Follow these steps to get the app up and running on your local machine:

1. Clone the repository using Git:

   git clone https://github.com/Tamils293/3dAnatomyDemo.git
   
2.Change to the project directory:

   cd 3dAnatomyDemo

3. Install the project dependencies using npm:

  npm install


4. Usage
Start the development server:

   npm run dev

 The app will be accessible at http://localhost:3000.


Navigate to the app and interact with the 3D anatomy model.

To mark positions on the model:

a. Open your browser's developer console.

b. Interact with the 3D model as needed to identify the desired positions.

c. In the console, copy the position data in the format:

json
Copy code form the console give copy object of a single vector,
{
    "x": 0.123,
    "y": -0.456,
    "z": 0.789
}
d. Navigate back to the app, and click the "upload" button.

e. Paste the copied position data into the provided textarea and click "Apply".

f. The marked position will now be displayed on the 3D model.

Contributing
Contributions are welcome! If you encounter any issues or have ideas for improvements, feel free to open an issue or submit a pull request.


