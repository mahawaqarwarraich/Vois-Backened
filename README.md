# BeMyHand

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

A web application that provides the four voice and eye-gaze controllable tools for our users who can not use their hands and provide them a complete toolkit to build a professional stance.
The tools are:

- Portfolio Web Page
- CV Builder
- Text Editor
- Article Directory


### Description of the main product element

### `Text Editor` 
This is a core module of our application that provides facility to write documents using voice and dictation. At the end the document can be saved as draft, converted and downloaded to PDF or Docx. It includes all the necessary components which a text editor should have to write professional documents i.e. headings, paragraphs, bullet points, inserting images, and applying decoration to the text like bold and italics. 

### `Articles Directory`
This module makes our users able to manage their articles directory by creating new articles, saving those as drafts, making articles private or public, maintaining version history and publishing them and this all by using their voice and eye-gaze.
This is the module where our target users can showcase their writing skills to the world. The recruiters/employers can visit and see their published work and contact them using their details available in their profile. 

### `CV Builder`
This module builds a professional CV by providing our users three professional templates at the very beginning. By selecting one out of the given 3 templates, all the fields can be filled by our user using their voice and all in a smooth and user-oriented way. The CV can be saved, added to the Portfolio Web Page (next module) or downloaded as a PDF. 

#### `Portfolio Builder`
This module makes a complete online presence of our users by providing them a webpage where they can add their top-quality work as well as their documents like CV, their details and this all using their voice and eye-gaze. Like CV Builder, it also provides 3 basic templates where a user can select one can build and style it by dragging and dropping complete sections, elements or styles. We provide a unique link to every user which they can share to the world and using that link they can visit their portfolio web page and see their work. 

## Project Status

BeMyHand is currently in development. Users can use text editor to write the articles with their voice and can also store them in articles directory.


## Implementation Details

The backend is implemented using RESTful architecture and it acts as a web service for our client accessing it with the well defined end points.

<img src="https://user-images.githubusercontent.com/38074593/102647549-b8197a80-4187-11eb-82d4-037d46bcb1ae.jpg" width=480 height=300>

We have routes, controllers and models to define endpoints, implement business logic and define schema respectively. This ensures a complete modular code with well defined folder and file names.

### `Validation and Security`
We have ensured to validate the payload sent to the endpoints before entering into the controllers and this saves a lot of time and saves our application from entering into unusual state. 
Moreover, we have also ensured security and have made use of JSON Web Tokens to transmit sensitive information between client and server.





