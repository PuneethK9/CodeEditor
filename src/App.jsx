
import { useEffect, useRef, useState } from 'react'
import './App.css'
import {Highlight,themes} from "prism-react-renderer"

function App() {

  // Stores content of textarea
  const [codeBlock,setcodeBlock] = useState(`    
    const Cat = props => {
      return (  
        <div>
          <h1>{props.name}</h1>
          <p>{props.color}</p>
        </div>;
      );
    };
    
    const GroceryItem: React.FC<GroceryItemProps> = ({ item }) => {
      return (
        <div>
          <h2>{item.name}</h2>
          <p>Price: {item.price}</p>
          <p>Quantity: {item.quantity}</p>
        </div>
      );
    }
    
    class MyComponent extends React.Component {
      render(){
        return (
          <React.Fragment>
            <div>I am an element!</div>
            <button>I am another element</button>
          </React.Fragment>
        );
      }
    }
    `
  );
 
  function Highlight_line(e)
  {
      /*
      MOTIVE:
      Hightlight the Number line the user clicks

      INTUITION:
      The Number of lines of code in text area will be
      same as number of divs in inside pre tag
      */

      // Get the necessaries of textarea
      // textareavalue : The content of the textarea
      // Selectionstart: The position of the cursor
      const textareavalue = e.currentTarget.value;
      const Selectionstart = e.currentTarget.selectionStart;

      //Split the string BEFORE cursor to get lines of code BEFORE cursor
      const Arraylines = textareavalue.substring(0,Selectionstart).split('\n');

      //Get all the number divs
      const nbrdiv = document.querySelectorAll("#nbrpar");
      
      // Reset background color of all divs
      // ( It resets the background color of previously clicked lines )
      nbrdiv.forEach(div => {
        div.style.backgroundColor = ""; 
      });

      //Different Line positions for different
      //Arrow buttons clicked
      let target = Arraylines.length-1;
      if(e.key=="ArrowDown")
      {
          const totallines = textareavalue.split('\n');
          if(totallines.length>Arraylines.length)
          target = target + 1;
      }
      else if(e.key=="ArrowUp")
      target = target - 1;

      if(Arraylines.length>1)
      {
          const focusdiv = nbrdiv[target];
          focusdiv.style.backgroundColor = "rgba(0,0,0,0.05)";
      }

      /*
      The above DARK-background color works perfectly fine
      for light themes, but is unnoticeable for dark themes.

      You can set the above background color to rgba(255,255,255,0.05)
      for Dark themes, but is unnoticeable for light themes.

      Similarly , the color of cursor should be changed
      white for dark themes and black for light themes
      */
  }

  function handlekey(e)
  {
      if(e.key=="Enter")
      {
          /*
          MOTIVE:
          Whenever Enter is pressed , the cursor
          should move to the next line following indetation
          */

          // Get the necessaries of textarea
          // textareavalue : The content of the textarea
          // Selectionstart: The position of the cursor
          // Selectionend: The end position of the cursor ( Will be same as Selectionstart if no text is selected )
          const textareavalue = e.currentTarget.value;
          const Selectionstart = e.currentTarget.selectionStart;
          const Selectionend = e.currentTarget.selectionEnd;

          //Checking if no text is selected
          if(Selectionstart==Selectionend)
          {
              //Prevent default behaviour
              e.preventDefault();

              //Get the string before cursor and
              //get the last line from it
              const previousline = (textareavalue.substring(0,Selectionstart).split('\n')).pop();

              //Match with spaces with the previous line
              const spaces = previousline?.match(/^\s+/);

              //Add a new line and spaces if matched
              const indent = '\n' + ((spaces?.[0])?spaces[0]:'    ');

              //Update the cursor position
              const newSelectionstart = Selectionstart + indent.length;

              //Hightlight the below line similar to ArrowDown
              e.key="ArrowDown";
              Highlight_line(e);

              //Update the value of textarea 
              //string before cursor + indentation + string after cursor
              const textarea = document.getElementById("text");
              textarea.value = textareavalue.substring(0,Selectionstart) + indent + textareavalue.substring(Selectionstart);
              textarea.selectionStart = newSelectionstart;
              textarea.selectionEnd = newSelectionstart;

              //Update the State
              setcodeBlock(textarea.value);
          }
      }
      else if(e.key=="Backspace")
      {
          /*
          PROBLEM:
          I have used 'position:absolute' to display the line numbers,
          so the cursor goes to the corner of textarea and hides 
          behind the numbers

          SOLUTION:
          I have to implement a backspace that doesn't go
          to the corner of textarea , it moves up if there
          are only 4 spaces or 4-character length space is left
          */

          // Get the necessaries of textarea
          // textareavalue : The content of the textarea
          // Selectionstart: The position of the cursor
          // Selectionend: The end position of the cursor ( Will be same as Selectionstart if no text is selected )
          const textareavalue = e.currentTarget.value;
          const Selectionstart = e.currentTarget.selectionStart;
          const Selectionend = e.currentTarget.selectionEnd;

          //Makes sure to move 4 spaces forward 
          // if cursor goes corner
          //Just !!PRESS BACKSPACE!!
          if(Selectionstart<=4)
          {
              const textarea = document.getElementById("text");
              textarea.selectionStart=Selectionstart+4;
          }

          //If no text is selected
          if(Selectionstart==Selectionend)
          {
              //Get the line on which cursor is present
              const currentline = textareavalue.substring(0,Selectionstart).split('\n').pop();
              
              if(currentline.length<=4)
              {
                  //Prevent default behaviour
                  e.preventDefault();

                  //Get the string before cursor and split it into Array of lines
                  const Arraylines = textareavalue.substring(0,Selectionstart).split('\n');

                  //You cannot go to previous lines if no lines are left right? so > 1
                  if(Arraylines.length>1)
                  {
                      //The cursor have to move to end of
                      //previour line , so u need position
                      //Add all the line lengths + 1 ( for new character )
                      //to get the position
                      let pos=0;
                      for(let i=0;i<(Arraylines.length-1);i++)
                      {
                          pos=pos+Arraylines[i].length+1;
                      }

                      //Hightlight above line similar to ArrowUp
                      e.key="ArrowUp";
                      Highlight_line(e);
                      
                      //Now you are at one step behind from 'end of previous line'
                      //update the positions , since there is an operation to perform
                      const textarea = document.getElementById("text");
                      textarea.selectionStart=pos;
                      textarea.selectionEnd=pos;

                      //You have to remove the '\n' from the end of previous line to
                      // avoid leaving a blank line below
                      //get string before cursor ( Leaving one character behind ) and string after cursor
                      const newvalue = textarea.value.substring(0,pos-1)+textarea.value.substring(pos);
                      //Update the position
                      pos--;

                      //Set the updations
                      textarea.value=newvalue;
                      textarea.selectionStart=pos;
                      textarea.selectionEnd=pos;

                      //update the state
                      setcodeBlock(newvalue);
                 }
              }
          }
      }
      else if(e.key=="Tab")
      {
          /*
          MOTIVE: 
          On Pressing Tab key 4 spaces should be added in the textarea..
          */

          // prevent default behaviour
          e.preventDefault();

          // Get the necessaries of textarea
          // textareavalue : The content of the textarea
          // Selectionstart: The position of the cursor
          const textarea = document.getElementById("text");
          const textareavalue = textarea.value;
          const Selectionstart = textarea.selectionStart;

          //                 --Get string before cursor--           --Add 4 spaces--    --Get string after cursor
          const newcontent = textareavalue.substring(0,Selectionstart)  +  "    "  +  textareavalue.substring(Selectionstart);

          textarea.value=newcontent; //Update the new content in textarea
          textarea.selectionStart=Selectionstart+4; //Update start position of cursor
          textarea.selectionEnd=Selectionstart+4;  //Update End postion of cursor

          //Update the State
          setcodeBlock(newcontent);
      }
      else if(e.key=="ArrowDown")
      {
          Highlight_line(e);
      }
      else if(e.key=="ArrowUp")
      {
          Highlight_line(e);
      }
  }

  return (

    <div id='con'>
      <div id='concenter'>

        <div id='btns'>
          <h3>Code Editor</h3>
          <div><a style={{color:"black"}} href='https://github.com/PuneethK9/CodeEditor'><i id='git' className="fa-brands fa-github"></i></a></div>
        </div>

        <textarea onClick={Highlight_line} rows={100} cols={100} onKeyDown={handlekey} spellCheck={false} name="Code" onChange={(e)=>{setcodeBlock(e.target.value)}} value={codeBlock} id="text" />

        <Highlight theme={themes.github} code={codeBlock} language="jsx">
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre id="constyle" style={style}>
                {tokens.map((line, i) => (
                    <div id='nbrpar' key={i} {...getLineProps({ line })}>
                      <span id='nbrs'>{i+1}     </span>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
              </pre>)}
        </Highlight>

      </div>
    </div>       
  )
}

export default App


