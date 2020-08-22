# Rien.js

To generate the compiler, use 
```bash
npm run build
```
The bundled compiler rien.umd.js will be generated in the pub folder

then example/index.js will be generated. Open example/index.html to see the result.


## What is Rien.js and what does it do?
Rien.js is a lightweight JavaScript Framework. It means nothing or naught in French, so when people ask about what technology they used in projects, they may answer “With Rien (With nothing)”, which would be quite interesting. Anyhow, the features of this framework deserve this name, I will show you why. 

We all know that there are countless technologies and frameworks for front-end development nowadays, and the most famous and commonly used three would be React, Vue and Angular. These are all great frameworks, but their sizes are quite large — even the smallest, Vue, has 58kB. It will not be a problem for those complicated projects, undoubtedly, but for those relatively small projects, or those which require a great performance, the size of those frameworks in the runtime would be too large. Rien.js does not aim to build extremely complicated projects, nor replace the market share of the existed frameworks. It aims to quickly create relatively small-sized and reusable components with little codes in the runtime, which could collaborate with other frameworks and technologies well. 

In order to fulfill features mentioned above, Rien.js would not use Virtual DOM. The diff and re-render algorithms of the Virtual DOM, though prevent inappropriate operations to manipulate native DOM, would be quite slow and resource-costing. Rien.js takes another approach to update DOM without finding the difference between the new and the old DOM tree, that is mapping the state-changing to the operation of the DOM node, and then updating the corresponding DOM node when the data is updated directly. 

## Who will use it and how will they use it?
Relatively experienced front-end developers may still apply the big three frameworks in their work, but when they build their personal projects, especially some small libraries or simple components, they might not want to use a sledgehammer to crack a nut. It is likely for them to choose Rien.js if they are interested in lightweight and elegant frameworks. With their experiences in other frameworks, it won’t be difficult for them to learn.

The developers with experiences only in Vanilla JS, HTML and CSS but no experiences in modern frameworks, would find Rien.js comes in handy since it has a shallow learning curve and similar syntax with Vanilla JS. They can take advantage of framework features without learning too many concepts. 

(Potential) Developers who work in a huge project, which have multiple parts implemented by different frameworks will also find Rien.js useful. They sometimes would require reusable components for all the frameworks, but it is too complicated or not very efficient if implemented with native JS or JQuery, they can use Rien.js to create reusable components quickly.

All the developers, when using Rien.js, will not worry that re-rendering would affect the performance, nor how to import fewer libraries to make the bundle size smaller. All they need to do is to write simple and elegant codes in Vanilla JS style, and the rest would be nothing.

## What has been implemented for the Alpha Release?
Till now, I have completed the HTML parser and HTML generator, which makes it way easier to add functionalities of parsing and generating JS and CSS later. I go through the whole template, use some regex to match HTML elements, attributes, and element contents and produce a well-structured AST (Abstract Syntax Tree) which includes all the information inside the template. Then I iterate the AST to generate a block of code that represents the component. Inside the component, I provided some lifecycle functions including create (), mount (), update (change) and detach (), so that we could easily change the content as we wish using JavaScript instead of manually manipulating the DOM. Since I write codes in ES6 module, I also used rollup for the bundle. I am pretty sure there might exist some corner cases that might fail, but since test code will not be considered in the evaluation and Professor Mark suggests not to, I did not provide any test.

## What can be seen on the page?
https://rienjs.herokuapp.com/examples.html
https://rienjs.herokuapp.com/examples.js
Do not expect too much right now. The drawback of my project is, though it is quite cool in terms of how it works and how it will end up like, there are not many visually fancy things to implement at least for the alpha release. There are only plenty of complicated and tedious string and data structure manipulations. What you will see on the page is naked HTML, without any visual effects or interactions. The only one thing that is somewhat interesting is, the page you see is not actually an HTML. Well, in fact, it was written in HTML, but since it went through my framework, it became the AST and then became the JavaScript code, which you might be able to see in the source code, and the JavaScript code here is auto-generated by my framework.

## What happens in the Object and what functions can be called?
Since my project is a framework, the object is a functional component, which has two parameters, target and props. The target would be the parent node of the component so that when we mount the component, it will be appended to target; props is used to send data into this component. The variables (e0, e1, …) which are generated with the first letter of the node type (element, root or text for now) and a counter, are used to record DOM nodes so that we could operate on them directly later. It returns four lifecycle functions, create (), mount (), update (changes), detach (); the specific DOM manipulation code has been implemented by the framework, so all developers need to do is to call them. Create () is the process of creating DOM nodes; mount () is used to connect nodes insides the component and connect the component to its parent node (i.e. the target); update (change) is used to change the values, contents of the component, since we have reference to all the nodes in the DOM tree directly, it is very fast; detach () is used to remove the node from its parent’s children.


## What is the next?
There are still many challenging things next, such as formatting the generated file (you can see in the example file, the format is chaos), parsing the JavaScript code (I might need some external libraries for these since even these tasks themselves can be a complete project). Another important thing is to support JS inside HTML, just like mustache or the {} expressions in the JSX. For that, I need to improve my parser to identify all those {} fragments and replace them with their real values. Besides that, there are still things that are less interesting to implement, such as mapping attributes, parsing CSS files, etc. I also plan to create a real-time editor and compiler on the webpage, so that it could compile the input template directly into JS codes (and CSS) and show the page content immediately. I believe that would show the elegance of my framework completely.



Final Submission – Rien.js
Name: Chenhao Jiang
Student Number: 1004732015
UTORID: jiangc54
Library Name: Rien.js
GitHub: https://github.com/csc309-summer-2020/js-library-jiangc54
Landing Page:  https://rienjs.herokuapp.com/
External Libraries: 
"@rollup/plugin-node-resolve": "^9.0.0",
    	"acorn": "^8.0.1",
    	"rollup": "^2.23.0"

API Document
<script></script>
A script block is very similar to what we had in the Vanilla JS, it contains the JavaScript codes that could be run when the instance is created. It contains basically all of the same use case as Vanilla JS. 

HTML Tags	
You can use any tags that you used to use in the Vanilla JS. These are still the same here. Rien.js would translate them into abstract syntax tree, and generate them into brower DOM, so all the tags you wrote here would be transferred to JavaScript DOM-related operations.

Attributes
Vanilla JS attributes still apply here, you can write exactly the same as Vanilla JS in terms of  attributes.

Dynamic attributes
	Finally, here comes something different with Vanilla JS. Instead of writing 
<input value=”JohnDoe”>
you can write it as 
<script> 
const state= {name: “JohnDoe”}
<script>
<input value={state.name}> 
Why bother? It seems you need to write more codes to get the same effect, but don’t forget you are always free to write orginal HTML. The benefit of this is you might want to update the value of input when state.name changes, but by writing this way, you do not need to use JavaScript to obtain the DOM node of that input tag, and use DOM operations to change its value, Rien has already done them for you.
What is more exciting is that you could even write functions insides dynamic attributes, just like what we did in React or Vue. Let’s wait and see.
 
Text 
You can still do what you did in Vanilla JS, write text insides tags, and if you need to change them later, you will use JavaScript and DOM manipulations. But with Rien.js, you can use variables in your text.
<script>
	const state = {name: “world”}
<script>
<h1>Hello, {state.name}!</h1>
It looks just like some template engines or React JSX syntax. Isn’t it cool?
The variables whose values are changed will automatically update to all the node that use these variables. The deep implementation is called data hijacking, which is the same approach that Vue.js used to update its view layer. The dynamic attributes is implemented using the same technics.

r-on (Event Listener)
People will get curious once they saw this in the example page. It is automatically binding listener of events. 
The usage is to add the event you want to listen right after r-on, and set a function to handle it. For example,
<input r-onInput={handleInput}>
So that when the input event of this input tag is triggered, the handleInput function would be called. Of course you need to define it in your <script> block.
Or even more,
<script>
	const state = {name: “”}
<script>
<input r-onInput={(e)=>(state.name=e.target.value) }
So you can directly get the value of input through state.name, just like React does.

 
r-bind (double-direction data binding)
As you might know that most of state managements modules prefers to use one-direction data flow. It might not be that cool, but it could be easier to debug and maintain. However, Vue still has v-model, for interaction convenience. Rien.js also has such thing, even though it is just a Syntactic sugar, it would still bring convenience to the process of developing.
<script>
	const state = {name: “”}
<script>
<input r-bind={state.name}>
In such way, if you modify the value through the input, it will update the value of state.name, if you modify the value through somewhere else, it will also update the value of input.

{r-for    r-end}
This is a new functionality in the process, it has not been finished, but right now it already could render list. (Did not Support updating)
<script>
  const state = {
    lst: [
      {id: 0, name: "Alpha", age: 10}, 
      {id: 1, name: "Bravo", age: 20},
    ]
  }
</script>
<div>    
  {r-for
    state.lst.map(item => 
      `<li>
	I am ${item.name}, I am ${item.age} years old
       </li>`
    )
  r-end}
</div>>

			


	

