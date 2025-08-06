let boxes=document.querySelectorAll(".box");
let newgame=document.querySelector(".newgame");
let turn0= true;
const winPatterns=[[0,1,2],[0,3,6],[0,4,8],[1,4,7],[2,5,8],[2,4,6],[3,4,5],[6,7,8]];
boxes.forEach((box) => {
    box.addEventListener("click",()=> {
        if (turn0){
            box.innerText="0";
            turn0=false;
        }
        else {
            box.innerText="x";
            turn0=true;
        } 
        box.disabled= true;
        checkWinner();
    })
});
const disableboxes=()=>{
    for(let box of boxes){
        box.disabled=true;
    }
};
const enableboxes=()=>{
    for(let box of boxes){
        box.disabled=false;
        box.innerText="";
        message_cont.classList.add("hide");
    }
};

const checkWinner=() =>{
    for(let pattern of winPatterns){
        let pos1val= boxes[pattern[0]].innerText;
        let pos2val= boxes[pattern[1]].innerText;
        let pos3val= boxes[pattern[2]].innerText;
    if (pos1val !="" && pos2val !="" && pos3val !=""){
    if(pos1val === pos2val && pos2val === pos3val){
        console.log("winner",pos1val);
        showwinner(pos1val);
    }
    }
    }
};
const showwinner=(winner)=>{
    message_cont.innertext='winner is ${winner}';
    message_cont.classList.remove("hide");
    disableboxes();
}
const newGame =()=>{
    turn0=true;
    enableboxes();
    box.innerText="";
}
newgame.addEventListener("click",newGame);