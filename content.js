
const content= {
    fileHTML:[
      "Home.html",
      "about.html",
      "Contact.html"  
    ],
    textHTML:[
      "Home",
      "About",
      "Contact"
    ]
}

const aside=document.getElementsByClassName('sidebar')[0];
const ul=document.createElement("ul");
ul.classList.add("side-nav");
for(let i=0;i<content.fileHTML.length;i++){
    const li=document.createElement("li");
    const a=document.createElement("a");
    a.setAttribute("href",content.fileHTML[i]);
    a.innerText=content.textHTML[i];
    
    li.appendChild(a);
    ul.appendChild(li);
}
aside.appendChild(ul);