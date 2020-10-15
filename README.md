# Rien.js
WARNING: This framework is archived. 

I had the idea years ago but got to implement it in 2020 since I think the popular frameworks right now are quite invasive, which could not be necessary. The virtual DOM is not necessary as well. I believe the DOM manipulation could have better API design, so I designed this.

However, I found there is a new framework called [Svelte](https://svelte.dev/), which seems quite great. It just fulfills what I thought of and already has a huge community and many contributors. So I decide not to reinvent the wheel. Svelte confirms some of my thoughts to be right, which I am quite happy about, and I believe it is a promising framework; however, on the other hand, it also reveals some problems, such as the code reusability problem, which I did not think of seriously before. I might be a contributor of svelte in the future, or not, but anyhow, I will always try to build something new (migbt replace the web environment).

Landing Page:  https://rienjs.herokuapp.com/

Document: https://rienjs.herokuapp.com/doc.html

External Libraries: 

```
"@rollup/plugin-node-resolve": "^9.0.0",
    	"acorn": "^8.0.1",
    	"rollup": "^2.23.0"
```


## Get Started
To generate the compiler, use 
```bash
npm run build
```
The bundled compiler rien.umd.js will be generated in the pub folder
Create a new js file named main.js, import compile function from rien as well as your .rien codes.
After compile, your codes would become Pure JavaScript codes.

### <script></script>
A script block is very similar to what we had in the Vanilla JS, it contains the JavaScript codes that could be run when the instance is created. It contains basically all of the same use case as Vanilla JS. 

### HTML Tags	
You can use any tags that you used to use in the Vanilla JS. These are still the same here. Rien.js would translate them into abstract syntax tree, and generate them into brower DOM, so all the tags you wrote here would be transferred to JavaScript DOM-related operations.

### Attributes
Vanilla JS attributes still apply here, you can write exactly the same as Vanilla JS in terms of  attributes.

### Dynamic attributes
Finally, here comes something different with Vanilla JS. Instead of writing 
```
<input value=”JohnDoe”>
you can write it as 
<script> 
const state= {name: “JohnDoe”}
<script>
<input value={state.name}> 
```
Why bother? It seems you need to write more codes to get the same effect, but don’t forget you are always free to write orginal HTML. The benefit of this is you might want to update the value of input when state.name changes, but by writing this way, you do not need to use JavaScript to obtain the DOM node of that input tag, and use DOM operations to change its value, Rien has already done them for you.
What is more exciting is that you could even write functions insides dynamic attributes, just like what we did in React or Vue. Let’s wait and see.
 
### Text 
You can still do what you did in Vanilla JS, write text insides tags, and if you need to change them later, you will use JavaScript and DOM manipulations. But with Rien.js, you can use variables in your text.
```
<script>
	const state = {name: “world”}
<script>
<h1>Hello, {state.name}!</h1>
```
It looks just like some template engines or React JSX syntax. Isn’t it cool?
The variables whose values are changed will automatically update to all the node that use these variables. The deep implementation is called data hijacking, which is the same approach that Vue.js used to update its view layer. The dynamic attributes is implemented using the same technics.

### r-on (Event Listener)
People will get curious once they saw this in the example page. It is automatically binding listener of events. 
The usage is to add the event you want to listen right after r-on, and set a function to handle it. For example,
```
<input r-onInput={handleInput}>
```
So that when the input event of this input tag is triggered, the handleInput function would be called. Of course you need to define it in your \<script> block.
Or even more,
```
<script>
	const state = {name: “”}
<script>
<input r-onInput={(e)=>(state.name=e.target.value) }
```
So you can directly get the value of input through state.name, just like React does.

 
### r-bind (double-direction data binding)
As you might know that most of state managements modules prefers to use one-direction data flow. It might not be that cool, but it could be easier to debug and maintain. However, Vue still has v-model, for interaction convenience. Rien.js also has such thing, even though it is just a Syntactic sugar, it would still bring convenience to the process of developing.
```
<script>
	const state = {name: “”}
<script>
<input r-bind={state.name}>
```
In such way, if you modify the value through the input, it will update the value of state.name, if you modify the value through somewhere else, it will also update the value of input.

### {r-for r-end}
This is a new functionality in the process, it has not been finished, but right now it already could render list. (Did not Support updating)
```
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
```



## What is Rien.js and what does it do?
Rien.js is a lightweight JavaScript Framework. It means nothing or naught in French, so when people ask about what technology they used in projects, they may answer “With Rien (With nothing)”, which would be quite interesting. Anyhow, the features of this framework deserve this name, I will show you why. 

We all know that there are countless technologies and frameworks for front-end development nowadays, and the most famous and commonly used three would be React, Vue and Angular. These are all great frameworks, but their sizes are quite large — even the smallest, Vue, has 58kB. It will not be a problem for those complicated projects, undoubtedly, but for those relatively small projects, or those which require a great performance, the size of those frameworks in the runtime would be too large. Rien.js does not aim to build extremely complicated projects, nor replace the market share of the existed frameworks. It aims to quickly create relatively small-sized and reusable components with little codes in the runtime, which could collaborate with other frameworks and technologies well. 

In order to fulfill features mentioned above, Rien.js would not use Virtual DOM. The diff and re-render algorithms of the Virtual DOM, though prevent inappropriate operations to manipulate native DOM, would be quite slow and resource-costing. Rien.js takes another approach to update DOM without finding the difference between the new and the old DOM tree, that is mapping the state-changing to the operation of the DOM node, and then updating the corresponding DOM node when the data is updated directly. 

## Who will use it and how will they use it?
Relatively experienced front-end developers may still apply the big three frameworks in their work, but when they build their personal projects, especially some small libraries or simple components, they might not want to use a sledgehammer to crack a nut. It is likely for them to choose Rien.js if they are interested in lightweight and elegant frameworks. With their experiences in other frameworks, it won’t be difficult for them to learn.

The developers with experiences only in Vanilla JS, HTML and CSS but no experiences in modern frameworks, would find Rien.js comes in handy since it has a shallow learning curve and similar syntax with Vanilla JS. They can take advantage of framework features without learning too many concepts. 

(Potential) Developers who work in a huge project, which have multiple parts implemented by different frameworks will also find Rien.js useful. They sometimes would require reusable components for all the frameworks, but it is too complicated or not very efficient if implemented with native JS or JQuery, they can use Rien.js to create reusable components quickly.

All the developers, when using Rien.js, will not worry that re-rendering would affect the performance, nor how to import fewer libraries to make the bundle size smaller. All they need to do is to write simple and elegant codes in Vanilla JS style, and the rest would be nothing.

