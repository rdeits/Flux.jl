var documenterSearchIndex = {"docs": [

{
    "location": "index.html#",
    "page": "Home",
    "title": "Home",
    "category": "page",
    "text": ""
},

{
    "location": "index.html#Flux-1",
    "page": "Home",
    "title": "Flux",
    "category": "section",
    "text": "Flux is a high-level interface for machine learning, implemented in Julia.Flux aims to be an intuitive and powerful notation, close to the mathematics, that provides advanced features like auto-unrolling and closures. Simple models are trivial, while the most complex architectures are tractable, taking orders of magnitude less code than in other frameworks. Meanwhile, the Flux compiler provides excellent error messages and tools for debugging when things go wrong.So what's the catch? Flux is at an early \"working prototype\" stage; many things work but the API is still in a state of... well, it might change. Also, this documentation is pretty incomplete.If you're interested to find out what does work, read on!"
},

{
    "location": "index.html#Installation-1",
    "page": "Home",
    "title": "Installation",
    "category": "section",
    "text": "... Charging Ion Capacitors ...Pkg.clone(\"https://github.com/MikeInnes/DataFlow.jl\")\nPkg.clone(\"https://github.com/MikeInnes/Flux.jl\")\nusing FluxYou'll also need a backend to run real training, if you don't have one already. Choose from MXNet or TensorFlow (MXNet is the recommended option if you're not sure):Pkg.add(\"MXNet\") # or \"TensorFlow\""
},

{
    "location": "models/basics.html#",
    "page": "Model Building Basics",
    "title": "Model Building Basics",
    "category": "page",
    "text": ""
},

{
    "location": "models/basics.html#Model-Building-Basics-1",
    "page": "Model Building Basics",
    "title": "Model Building Basics",
    "category": "section",
    "text": ""
},

{
    "location": "models/basics.html#The-Model-1",
    "page": "Model Building Basics",
    "title": "The Model",
    "category": "section",
    "text": "... Initialising Photon Beams ...The core concept in Flux is the model. A model (or \"layer\") is simply a function with parameters. For example, in plain Julia code, we could define the following function to represent a logistic regression (or simple neural network):W = randn(3,5)\nb = randn(3)\naffine(x) = W * x + b\n\nx1 = rand(5) # [0.581466,0.606507,0.981732,0.488618,0.415414]\ny1 = softmax(affine(x1)) # [0.32676,0.0974173,0.575823]affine is simply a function which takes some vector x1 and outputs a new one y1. For example, x1 could be data from an image and y1 could be predictions about the content of that image. However, affine isn't static. It has parameters W and b, and if we tweak those parameters we'll tweak the result – hopefully to make the predictions more accurate.This is all well and good, but we usually want to have more than one affine layer in our network; writing out the above definition to create new sets of parameters every time would quickly become tedious. For that reason, we want to use a template which creates these functions for us:affine1 = Affine(5, 5)\naffine2 = Affine(5, 5)\n\nsoftmax(affine1(x1)) # [0.167952, 0.186325, 0.176683, 0.238571, 0.23047]\nsoftmax(affine2(x1)) # [0.125361, 0.246448, 0.21966, 0.124596, 0.283935]We just created two separate Affine layers, and each contains its own version of W and b, leading to a different result when called with our data. It's easy to define templates like Affine ourselves (see The Template), but Flux provides Affine out of the box, so we'll use that for now."
},

{
    "location": "models/basics.html#Combining-Models-1",
    "page": "Model Building Basics",
    "title": "Combining Models",
    "category": "section",
    "text": "... Inflating Graviton Zeppelins ...A more complex model usually involves many basic layers like affine, where we use the output of one layer as the input to the next:mymodel1(x) = softmax(affine2(σ(affine1(x))))\nmymodel1(x1) # [0.187935, 0.232237, 0.169824, 0.230589, 0.179414]This syntax is again a little unwieldy for larger networks, so Flux provides another template of sorts to create the function for us:mymodel2 = Chain(affine1, σ, affine2, softmax)\nmymodel2(x2) # [0.187935, 0.232237, 0.169824, 0.230589, 0.179414]mymodel2 is exactly equivalent to mymodel1 because it simply calls the provided functions in sequence. We don't have to predefine the affine layers and can also write this as:mymodel3 = Chain(\n  Affine(5, 5), σ,\n  Affine(5, 5), softmax)You now know enough to take a look at the logistic regression example, if you haven't already."
},

{
    "location": "models/basics.html#A-Function-in-Model's-Clothing-1",
    "page": "Model Building Basics",
    "title": "A Function in Model's Clothing",
    "category": "section",
    "text": "... Booting Dark Matter Transmogrifiers ...We noted above that a \"model\" is a function with some number of trainable parameters. This goes both ways; a normal Julia function like exp is effectively a model with 0 parameters. Flux doesn't care, and anywhere that you use one, you can use the other. For example, Chain will happily work with regular functions:foo = Chain(exp, sum, log)\nfoo([1,2,3]) == 3.408 == log(sum(exp([1,2,3])))"
},

{
    "location": "models/recurrent.html#",
    "page": "Recurrence",
    "title": "Recurrence",
    "category": "page",
    "text": ""
},

{
    "location": "models/recurrent.html#Recurrent-Models-1",
    "page": "Recurrence",
    "title": "Recurrent Models",
    "category": "section",
    "text": "[WIP]"
},

{
    "location": "models/debugging.html#",
    "page": "Debugging",
    "title": "Debugging",
    "category": "page",
    "text": ""
},

{
    "location": "models/debugging.html#Debugging-Models-1",
    "page": "Debugging",
    "title": "Debugging Models",
    "category": "section",
    "text": "Let's take our two-layer perceptron as an example again, running on MXNet:@net type TLP\n  first\n  second\n  function (x)\n    l1 = σ(first(x))\n    l2 = softmax(second(l1))\n  end\nend\n\nmodel = TLP(Affine(10, 20), Affine(21, 15))\n\nmxmodel = mxnet(model, (1, 20))Unfortunately, this model has a (fairly obvious) typo, which means that the code above won't run. Instead we get an error message:InferShape Error in dot5: [20:37:39] src/operator/./matrix_op-inl.h:271: Check failed: (lshape[1]) == (rshape[0]) dot shape error: (15,21) X (20,1)\n in Flux.Affine at affine.jl:8\n in TLP at test.jl:6\n in mxnet(::TLP, ::Tuple{Int64,Int64}) at model.jl:40\n in mxnet(::TLP, ::Vararg{Any,N} where N) at backend.jl:20Most frameworks would only give the error message here – not so helpful if you have thousands of nodes in your computational graph. However, Flux is able to give good error reports even when no Julia code has been run, e.g. when running on a backend like MXNet. This enables us to pinpoint the source of the error very quickly even in a large model.In this case, we can immediately see that the error occurred within an Affine layer. There are two such layers, but this one was called from the second line of TLP, so it must be the second Affine layer we defined. The layer expected an input of length 21 but got 20 instead.Of course, often a stack trace isn't enough to figure out the source of an error. Another option is to simply step through the execution of the model using Gallium. While handy, however, stepping isn't always the best way to get a \"bird's eye view\" of the code. For that, Flux provides a macro called @shapes:julia> @shapes model(rand(5,10))\n\n# /Users/mike/test.jl, line 18:\ngull = σ(Affine(10, 20)(Input()[1]::(5,10))::(5,20))::(5,20)\n# /Users/mike/.julia/v0.6/Flux/src/layers/affine.jl, line 8:\nlobster = gull * _::(21,15) + _::(1,15)\n# /Users/mike/test.jl, line 19:\nraven = softmax(lobster)This is a lot like Julia's own code_warntype; but instead of annotating expressions with types, we display their shapes. As a lowered form it has some quirks; input arguments are represented by Input()[N] and parameters by an underscore.This makes the problem fairly obvious. We tried to multiply the output of the first layer (5, 20) by a parameter (21, 15); the inner dimensions should have been equal.Notice that while the first Affine layer is displayed as-is, the second was inlined and we see a reference to where the W * x + b line was defined in Flux's source code. In this way Flux makes it easy to drill down into problem areas, without showing you the full graph of thousands of nodes at once.With the typo fixed, the output of @shapes looks as follows:# /Users/mike/test.jl, line 18:\nopossum = σ(Affine(10, 20)(Input()[1]::(5,10))::(5,20))::(5,20)\n# /Users/mike/test.jl, line 19:\nwren = softmax(Affine(20, 15)(opossum)::(5,15))::(5,15)"
},

{
    "location": "examples/logreg.html#",
    "page": "Logistic Regression",
    "title": "Logistic Regression",
    "category": "page",
    "text": ""
},

{
    "location": "examples/logreg.html#Logistic-Regression-with-MNIST-1",
    "page": "Logistic Regression",
    "title": "Logistic Regression with MNIST",
    "category": "section",
    "text": "[WIP]"
},

{
    "location": "contributing.html#",
    "page": "Contributing & Help",
    "title": "Contributing & Help",
    "category": "page",
    "text": ""
},

{
    "location": "contributing.html#Contributing-1",
    "page": "Contributing & Help",
    "title": "Contributing",
    "category": "section",
    "text": "[WIP]"
},

{
    "location": "internals.html#",
    "page": "Internals",
    "title": "Internals",
    "category": "page",
    "text": ""
},

{
    "location": "internals.html#Internals-1",
    "page": "Internals",
    "title": "Internals",
    "category": "section",
    "text": "[WIP]"
},

]}
