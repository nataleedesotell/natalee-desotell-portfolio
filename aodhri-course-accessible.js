// TO DO LIST:
// 1) Figure out how to combine files (grunt) and load into Canvas
// 2) Check that next btn is working
// 3) Make a list of each module that still needs edits + what those edits are
var btn = document.createElement("BUTTON");

  // Because of a race condition with Canvas, check for the next button about 5 times to hide it.
  function hideNext(checkCurr) {
    // console.log('Checked for the next button ' + checkCurr + ' times.');
    // $nextButton = $('.module-sequence-footer-button--next');
    // $nextButton.hide();

    // if ($nextButton.length < 1 && checkCurr < checksMax) {
    //   setTimeout(function () {
    //     hideNext(checkCurr + 1);
    //   }, 100);
    // }

    console.log("hideNext was called")
  }

  function allowNext() {
    // alert('Success!')
    // $nextButton.show();
    console.log("allowNext was called")
	alert("Next button triggered");
  }

  //NIGHT OUT SCRIPT

  if ($('#Sel').length) {
    console.log("Sel exists");
    var colors = [
      'papaya',
      'mustard',
      'blush',
      'aqua',
      'teal-dark',
      'forest',
      'eggplant',
      'pumpkin-dark'
    ];
    // Hide the next button
    hideNext(0);
    var nightOutItemsMin = 3;
    console.log("minimum selection set at " + nightOutItemsMin);
    // Make the elements draggable
    var drake = dragula([document.querySelector('.alc-learn--night-out__word-cloud'), document.querySelector('.alc-learn--night-out__response')]);

    // On every drop, if bag has enough element, show next button.
    //I think this needs to be a different indicator, like on every release of a mouse, check? Or something
    //not related to dragula since that's not what I'm using... 
    drake.on('drop', function(el, target, source, sibling) {
      if ($('#Sel').children().length >= nightOutItemsMin) {
        // Specific for Night Out #2
        if ($('#alc-learn--night-out__slide-two').length > 0) {
          $('.alc-learn--night-out__word-cloud').fadeOut(function() {
            $('.alc-learn--night-out__success').fadeIn()
          });
        }
        // General
        allowNext();
      }
    });

    // Shift position slightly and change color of each item
    $('.words').each(function(one, two) {
      var xChange = Math.random() * 12;
      var yChange = -(Math.random() * 12);

      $(this).css({
        '-webkit-transform': 'translate(' + xChange + 'px, ' + yChange + 'px)',
        'transform': 'translate(' + xChange + 'px, ' + yChange + 'px)',
      }).addClass('yoac-' + colors[Math.floor(Math.random()*colors.length)]);
    })
  }



//OUTSIDE A FUNCTION - why isn't this being called?


function check() {
if ($('#Sel').children().length >= 4) {
   	console.log("made it to ifdraggablechildren");
    // Specific for Night Out #2
    if ($('#alc-learn--night-out__slide-two').length > 0) {
          $('.alc-learn--night-out__word-cloud').fadeOut(function() {
            $('.alc-learn--night-out__success').fadeIn()
          });
        }
        // General
        allowNext();
    }
 };


// Function to get elements by class name for DOM fragment and tag name
function getElementsByClassName(objElement, strTagName, strClassName)
{
	var objCollection = objElement.getElementsByTagName(strTagName);
	var arReturn = [];
	var strClass, arClass, iClass, iCounter;
	// console.log( "getElementsByClassName, objElement is" objElement " and strTagName is" strTagName " and srtClassName is " srtClassName);

	for(iCounter=0; iCounter<objCollection.length; iCounter++)
	{
		strClass = objCollection[iCounter].className;
		if (strClass)
		{
			arClass = strClass.split(' ');
			for (iClass=0; iClass<arClass.length; iClass++)
			{
				if (arClass[iClass] == strClassName)
				{
					arReturn.push(objCollection[iCounter]);
					break;
				}
			}
		}
	}

	objCollection = null;
	return (arReturn);
}

var drag = {
	objCurrent : null,

	arTargets : ['Unsel', 'Sel'],

	initialise : function(objNode)
	{
		// Add event handlers
		objNode.onmousedown = drag.start;
		objNode.onclick = function() {this.focus();};
		objNode.onkeydown = drag.keyboardDragDrop;
		document.body.onclick = drag.removePopup;
		console.log("initialize");
		check();
	},

	keyboardDragDrop : function(objEvent)
	{
		objEvent = objEvent || window.event;
		drag.objCurrent = this;
		var arChoices = ['Unselect activity', 'Select activity'];
		var iKey = objEvent.keyCode;
		var objItem = drag.objCurrent;

			var strExisting = objItem.parentNode.getAttribute('id');
			var objMenu, objChoice, iCounter;
			console.log("keyboardDragDrop");

			if (iKey == 32)
			{
				document.onkeydown = function(){return objEvent.keyCode==38 || objEvent.keyCode==40 ? false : true;};
				// Set ARIA properties
				drag.objCurrent.setAttribute('aria-grabbed', 'true');
				drag.objCurrent.setAttribute('aria-owns', 'popup');
				// Build context menu
				objMenu = document.createElement('ul');
				objMenu.setAttribute('id', 'popup');
				objMenu.setAttribute('role', 'menu');
				for (iCounter=0; iCounter<arChoices.length; iCounter++)
				{
					if (drag.arTargets[iCounter] != strExisting)
					{
						objChoice = document.createElement('div');
						objChoice.appendChild(document.createTextNode(arChoices[iCounter]));
						objChoice.tabIndex = -1;
						objChoice.setAttribute('role', 'menuitem');
						objChoice.onmousedown = function() {drag.dropObject(this.firstChild.data.substr(0, 3));};
						objChoice.onkeydown = drag.handleContext;
						objChoice.onmouseover = function() {if (this.className.indexOf('hover') < 0) {this.className += ' hover';} };
						objChoice.onmouseout = function() {this.className = this.className.replace(/\s*hover/, ''); };
						objMenu.appendChild(objChoice);
					}
				}
				objItem.appendChild(objMenu);
				objMenu.firstChild.focus();
				objMenu.firstChild.className = 'focus';
				drag.identifyTargets(true);
			}
	},

	removePopup : function()
	{
		document.onkeydown = null;
		//this prints how many divs are inside #Sel, which will help me call allowNext when appropriate
		var ct = $('#Sel').children().length;
		console.log(ct);
		var objContext = document.getElementById('popup');
		console.log("removePopup")

		if (objContext)
		{
			objContext.parentNode.removeChild(objContext);
		}
	},

	handleContext : function(objEvent)
	{
		objEvent = objEvent || window.event;
		var objItem = objEvent.target || objEvent.srcElement;
		var iKey = objEvent.keyCode;
		var objFocus, objList, strTarget, iCounter;

		// Cancel default behaviour
		if (objEvent.stopPropagation)
		{
			objEvent.stopPropagation();
		}
		else if (objEvent.cancelBubble)
		{
			objEvent.cancelBubble = true;
		}
		if (objEvent.preventDefault)
		{
			objEvent.preventDefault();
		}
		else if (objEvent.returnValue)
		{
			objEvent.returnValue = false;
		}

		switch (iKey)
		{
			case 38 : // Down arrow
				objFocus = objItem.nextSibling;
				if (!objFocus)
				{
					objFocus = objItem.previousSibling;
				}
				objItem.className = '';
				objFocus.focus();
				objFocus.className = 'focus';
				break;
			case 40 : // Up arrow
				objFocus = objItem.previousSibling;
				if (!objFocus)
				{
					objFocus = objItem.nextSibling;
				}
				objItem.className = '';
				objFocus.focus();
				objFocus.className = 'focus';
				break;
			case 13 : // Enter
				strTarget = objItem.firstChild.data.substr(0, 3);
				drag.dropObject(strTarget);
				break;
			case 27 : // Escape
			case 9  : // Tab
				drag.objCurrent.removeAttribute('aria-owns');
				drag.objCurrent.removeChild(objItem.parentNode);
				drag.objCurrent.focus();
				for (iCounter=0; iCounter<drag.arTargets.length; iCounter++)
				{
					objList = document.getElementById(drag.arTargets[iCounter]);
					drag.objCurrent.setAttribute('aria-grabbed', 'false');
					objList.removeAttribute('aria-dropeffect');
					objList.className = '';
				}
				break;
		}
	},

	start : function(objEvent)
	{
		objEvent = objEvent || window.event;
		drag.removePopup();
		// Initialise properties
		drag.objCurrent = this;

		drag.objCurrent.lastX = objEvent.clientX;
		drag.objCurrent.lastY = objEvent.clientY;
		drag.objCurrent.style.zIndex = '2';
		drag.objCurrent.setAttribute('aria-grabbed', 'true');

		document.onmousemove = drag.drag;
		document.onmouseup = drag.end;
		drag.identifyTargets(true);

		return false;
	},

	drag : function(objEvent)
	{
		objEvent = objEvent || window.event;

		// Calculate new position
		var iCurrentY = objEvent.clientY;
		var iCurrentX = objEvent.clientX;
		var iYPos = parseInt(drag.objCurrent.style.top, 10);
		var iXPos = parseInt(drag.objCurrent.style.left, 10);
		var iNewX, iNewY;

		iNewX = iXPos + iCurrentX - drag.objCurrent.lastX;
		iNewY = iYPos + iCurrentY - drag.objCurrent.lastY;

		drag.objCurrent.style.left = iNewX + 'px';
		drag.objCurrent.style.top = iNewY + 'px';
		drag.objCurrent.lastX = iCurrentX;
		drag.objCurrent.lastY = iCurrentY;

		return false;
	},

	calculatePosition : function (objElement, strOffset)
	{
		var iOffset = 0;

		// Get offset position in relation to parent nodes
		if (objElement.offsetParent)
		{
			do 
			{
				iOffset += objElement[strOffset];
				objElement = objElement.offsetParent;
			} while (objElement);
		}

		return iOffset;
	},

	identifyTargets : function (bHighlight)
	{
		var strExisting = drag.objCurrent.parentNode.getAttribute('id');
		var objList, iCounter;

		// Highlight the targets for the current drag item
		for (iCounter=0; iCounter<drag.arTargets.length; iCounter++)
		{
			objList = document.getElementById(drag.arTargets[iCounter]);
			if (bHighlight && drag.arTargets[iCounter] != strExisting)
			{
				objList.className = 'highlight';
				objList.setAttribute('aria-dropeffect', 'move');
			}
			else
			{
				objList.className = '';
				objList.removeAttribute('aria-dropeffect');
			}
		}
	},

	getTarget : function()
	{
		var strExisting = drag.objCurrent.parentNode.getAttribute('id');
		var iCurrentLeft = drag.calculatePosition(drag.objCurrent, 'offsetLeft');
		var iCurrentTop = drag.calculatePosition(drag.objCurrent, 'offsetTop');
		var iTolerance = 40;
		var objList, iLeft, iRight, iTop, iBottom, iCounter;

		for (iCounter=0; iCounter<drag.arTargets.length; iCounter++)
		{
			if (drag.arTargets[iCounter] != strExisting)
			{
				// Get position of the list
				objList = document.getElementById(drag.arTargets[iCounter]);
				iLeft = drag.calculatePosition(objList, 'offsetLeft') - iTolerance;
				iRight = iLeft + objList.offsetWidth + iTolerance;
				iTop = drag.calculatePosition(objList, 'offsetTop') - iTolerance;
				iBottom = iTop + objList.offsetHeight + iTolerance;

				// Determine if current object is over the target
				if (iCurrentLeft > iLeft && iCurrentLeft < iRight && iCurrentTop > iTop && iCurrentTop < iBottom)
				{
					return drag.arTargets[iCounter];
				}
			}
		}

		// Current object is not over a target
		return '';
	},

	dropObject : function(strTarget)
	{
		var objClone, objOriginal, objTarget, objEmpty, objBands, objItem;

		drag.removePopup();

		if (strTarget.length > 0)
		{
			// Copy node to new target
			objOriginal = drag.objCurrent.parentNode;
			objClone = drag.objCurrent.cloneNode(true);

			// Remove previous attributes
			objClone.removeAttribute('style');
			objClone.className = objClone.className.replace(/\s*focused/, '');
			objClone.className = objClone.className.replace(/\s*hover/, '');

			// Add focus indicators
			objClone.onfocus = function() {this.className += ' focused'; };
			objClone.onblur = function() {this.className = this.className.replace(/\s*focused/, '');};
			objClone.onmouseover = function() {if (this.className.indexOf('hover') < 0) {this.className += ' hover';} };
			objClone.onmouseout = function() {this.className = this.className.replace(/\s*hover/, ''); };

			objTarget = document.getElementById(strTarget);
			objOriginal.removeChild(drag.objCurrent);
			objTarget.appendChild(objClone);
			drag.objCurrent = objClone;
			drag.initialise(objClone);

			// Remove empty node if there are artists in list
			objEmpty = getElementsByClassName(objTarget, 'div', 'empty');
			if (objEmpty[0])
			{
				objTarget.removeChild(objEmpty[0]);
			}

			// Add an empty node if there are no artists in list
			objBands = objOriginal.getElementsByTagName('div');
			if (objBands.length === 0)
			{
				objItem = document.createElement('div');
				objItem.appendChild(document.createTextNode('Drag activities here...'));
				objItem.className = 'empty';
				objOriginal.appendChild(objItem);
			}
		}
				// Reset properties
		drag.objCurrent.style.left = '0px';
		drag.objCurrent.style.top = '0px';

		drag.objCurrent.style.zIndex = 'auto';
		drag.objCurrent.setAttribute('aria-grabbed', 'false');
		drag.objCurrent.removeAttribute('aria-owns');

		drag.identifyTargets(false);
	},

	end : function()
	{
		var strTarget = drag.getTarget();

		drag.dropObject(strTarget);

		document.onmousemove = null;
		document.onmouseup   = null;
		drag.objCurrent = null;
	}
};

function init ()
{
	var objItems = getElementsByClassName(document, 'div', 'draggable');
	var objItem, iCounter;

	for (iCounter=0; iCounter<objItems.length; iCounter++)
	{
		// Set initial values so can be moved
		objItems[iCounter].style.top = '0px';
		objItems[iCounter].style.left = '0px';

		// Put the list items into the keyboard tab order
		objItems[iCounter].tabIndex = 0;

		// Set ARIA attributes for artists
		objItems[iCounter].setAttribute('aria-grabbed', 'false');
		objItems[iCounter].setAttribute('aria-haspopup', 'true');
		objItems[iCounter].setAttribute('role', 'listitem');

		// Provide a focus indicator
		objItems[iCounter].onfocus = function() {this.className += ' focused'; };
		objItems[iCounter].onblur = function() {this.className = this.className.replace(/\s*focused/, '');};
		objItems[iCounter].onmouseover = function() {if (this.className.indexOf('hover') < 0) {this.className += ' hover';} };
		objItems[iCounter].onmouseout = function() {this.className = this.className.replace(/\s*hover/, ''); };

		drag.initialise(objItems[iCounter]);
	}

	// Set ARIA properties on the drag and drop list, and set role of this region to application
	for (iCounter=0; iCounter<drag.arTargets.length; iCounter++)
	{
		objItem = document.getElementById(drag.arTargets[iCounter]);
		objItem.setAttribute('aria-labelledby', drag.arTargets[iCounter] + 'h');
		objItem.setAttribute('role', 'list');
	}

	objItem = document.getElementById('dragdrop');
	objItem.setAttribute('role', 'application');
	

	objItems = null;
}

// DIALOGUE CODE
  function runDialogue(dialogue) {
    function stepForward() {
      // If not initial step, clear dialogue from both comp and user
      if (currLine > 0) {
        $('.alc-learn--dialogue__both').fadeOut({
          queue: false
        }).empty().promise().done(function () {
          // Need promise so that callback only fires once https://stackoverflow.com/questions/8793246/jquery-animate-multiple-elements-but-only-fire-callback-once
          insertNext()
        });
      } else {
        insertNext()
      }
    }

    function insertNext() {
      // If there's a prompt, show it and the available answers
      if (dialogue[currLine].prompt) {
        $promptDialogue
        .append(
          '<div class="talk-bubble tri-right border round btm-left-in"><p>' +  dialogue[currLine].prompt + '</p></div>')
        .delay(delayTime)
        .children()
        .fadeIn().promise().done(function () {
          // Need promise so that callback only fires once https://stackoverflow.com/questions/8793246/jquery-animate-multiple-elements-but-only-fire-callback-once

          var colorSchemes = [
            'talk-bubble__color-1',
          ];

          // Populate reponse options
          dialogue[currLine].answers.forEach(function(answer) {
            $answersDialogue
            .append('<div class="dialogue-option talk-bubble tri-right border round btm-right-in ' + colorSchemes.splice(Math.random() * colorSchemes.length, 1) + '" data-next_label=' + answer.next + '><p>' + answer.m + '</p><div class="yoac-choose"> < </div></div>')
          })

          // Fade reponse options in
          $answersDialogue.delay(delayTime).children().fadeIn()
          // Prepare for next step of dialogue
          currLine++;
        })
      } else if (dialogue[currLine].moral) {
        // If it's the moral, we've reached the end
        $moralDialogue
        .html('<p>' + dialogue[currLine].moral+ '</p>')
        .delay(delayTime)
        .fadeIn(function() {
          allowNext();
        })
      }
    }

    // Hide the next button
    hideNext(0);

    var $promptDialogue = $('#alc-learn--dialogue__prompt');
    var $answersDialogue = $('#alc-learn--dialogue__answers');
    var $moralDialogue = $('#alc-learn--dialogue__moral');
    var delayTime = 400;
    var currLine = 0;

    // When user clicks on an answer, set currLine according to 'next' field, or just bump it otherwise
    $answersDialogue.on('click', '.dialogue-option', function() {
      var nextLabel = $(this).data().next_label;
      // Fade out dialogue that user has not selected
      $(this)
      .addClass('yoac__selected')
      .siblings()
      .not('.yoac__selected')
      .fadeOut({
        queue: false
      }).promise().done(function () {
        // Need promise so that callback only fires once https://stackoverflow.com/questions/8793246/jquery-animate-multiple-elements-but-only-fire-callback-once

        // Remove talk bubbles that were not selected from DOM
        $(this).remove()

        // If there's a specific response to the given answer, find it in dialogue array and update currLine to match
        if (nextLabel) {
          for (var line in dialogue) {
            if (dialogue[line].label === nextLabel) {
              currLine = line;
            }
          }
        } else {
          currLine++
        }
        stepForward(currLine);
      });

    })

    stepForward(currLine);
  }


  // Dialogue 1 Script
  // if this id exists...
  if ($('#alc-learn--dialogue__slide-one').length) {
    // then, run dialogue
    runDialogue([
      {
        prompt: 'Hey I’m tired AF. Wanna head back to our suite?',
        answers: [
          {
            m: 'Yeah, totally. I’m pretty tired too.',
            next: 'tired_agree'
          },
          {
            m: 'The music just got good! But I heard Cory wanted to head out.  Let’s see if you two can walk home together.',
            next: 'tired_cory'

          },
          {
            m: 'Sure. Can we stop for food on the way?',
            next: 'tired_food'
          }
        ]
      },
      {
        label: 'tired_agree',
        moral: 'You don’t have to shut down the party!  If you’re ready to leave, do it.  You could head back to your suite to catch up on your favorite shows – or better yet, actually get some sleep.'
      },
      {
        label: 'tired_cory',
        moral: 'That’s great! At Yale we look out for each other. It’s fine if you don’t want to leave when your friend does, but make sure they have a way to get home safely.  Remember you can always call the Yale Nighttime Shuttle, which takes students door-to-door from 6pm to 6am.'
      },
      {
        label: 'tired_food',
        moral: 'That’s great! At Yale we look out for each other. And just because you’ve left a party, it doesn’t need to be the end of your night.  Get food (your froco may be serving late-night pancakes!), watch a movie, just hang.'
      }
    ])
  }



  // Dialogue 2 Script
  if ($('#alc-learn--dialogue__slide-two').length) {
    runDialogue(
      [
        {
          prompt: 'Hey we’re all doing shots. Take one!',
          answers: [
            {
              m: 'Oh, no thanks. I’m good.',
              next: 'shots_good'
            },
            {
              m: 'Nahh. I said I was going to stick to one beer tonight.',
              next: 'shots_beer'
            },
            {
              m: 'I’m actually heading out. Next time though?',
              next: 'shots_leaving'
            }
          ]
        },
        {
          label: 'shots_good',
          prompt: 'C’mon, we don’t want you to miss out!',
          answers: [
            {
              m: "I’m still gonna hang, but I don’t drink.",
              next: 'shots_moral_easy'
            },
            {
              m: "Nah, I’m tryna hook up tonight.",
              next: 'shots_moral_sober'
            },
            {
              m: "I’m heading out. Maybe next time.",
              next: 'shots_moral_call'
            },
            {
              m: "Nope, not tonight.",
              next: 'shots_moral_easy_alt'
            }
          ]
        },
        {
          label: 'shots_beer',
          prompt: 'C’mon, we don’t want you to miss out!',
          answers: [
            {
              m: "I would, but I’m feeling pretty good about this beer.",
              next: 'shots_moral_shots'
            },
            {
              m: "I’m chillin’. I’ve got stuff to do tomorrow.",
              next: 'shots_moral_plans'
            },
            {
              m: "Nah, I’m tryna hook up tonight.",
              next: 'shots_moral_sober'
            },
            {
              m: "I’m heading out, maybe next time?",
              next: 'shots_moral_call'
            }
          ]
        },
        {
          label: 'shots_leaving',
          prompt: 'C’mon, we don’t want you to miss out!',
          answers: [
            {
              m: "Me either, but I’ll catch you this weekend.",
              next: 'shots_moral_call'
            },
            {
              m: "Nah, I’m tryna hook up tonight.",
              next: 'shots_moral_mindful'
            },
            {
              m: "Way too tired. See ya around.",
              next: 'shots_moral_call'
            }
          ]
        },
        {
          label: 'shots_moral_easy',
          moral: 'Great answer! It might not be easy to tell, but there are lots of students who choose not to drink on campus and still have active social lives. Setting those boundaries doesn’t mean that you can’t still hang out with friends who are drinking and have a good time!'
        },
        {
          label: 'shots_moral_sober',
          moral: "Good thinking! Sober (or relatively sober) hookups allow you to be more attentive to your partner's desires. That’s more fun for everyone!"
        },
        {
          label: 'shots_moral_call',
          moral: "Good call! You shouldn’t have to leave a gathering because of pressure from others, but if you feel uncomfortable, that’s always an option. Better to find someplace where your decisions are respected!"
        },
        {
          label: 'shots_moral_easy_alt',
          moral: "That’s great! It might not be easy to tell, but there are lots of students who choose not to drink, either on some nights or always, and who still have active social lives. Setting those boundaries doesn’t mean that you can’t still hang out with friends who are drinking and have a good time!"
        },
        {
          label: 'shots_moral_shots',
          moral: "That’s great! It might not be easy to tell, but there are lots of students who choose not to drink, either on some nights or always, and who still have active social lives. Setting those boundaries doesn’t mean that you can’t still hang out with friends who are drinking and have a good time!"
        },
        {
          label: 'shots_moral_plans',
          moral: "Great response – whether or not you actually have big plans for tomorrow. If you do, it’s smart to slow down on drinking, since heavy drinking can affect sleep quality and a hangover is generally bad news for next day tasks. And even if you don’t have plans, saying so can be a good way to deflect pressure."
        },
        {
          label: 'shots_moral_mindful',
          moral: "Good thinking! If you drink, you should extra mindful of your actions and interactions with others. Plus, heavy drinking will seriously detract from a hookup. Staying sober means it’s easy to be more attentive to your partner's desires–and that’s more fun for everyone!"
        }
      ]
    )
  }

  // Dialogue 3 Script
  if ($('#alc-learn--dialogue__slide-three').length) {
    runDialogue([
      {
        prompt: 'This week sucked. I’m going so hard tonight. Can’t wait to turn up.',
        answers: [
          {
            m: 'Wow. Sounds like you had a rough week. Any chance you wanna do a low key night with me instead? Maybe stay in and watch a movie?',
            next: 'hard_stay'
          },
          {
            m: 'I’m pumped for tonight too. Sorry to hear about your week! Wanna grab dinner and talk about it before?',
            next: 'hard_dinner'

          },
          {
            m: 'I want you to let out some steam, for sure.  But I feel like I’ve heard this from a you a lot lately. I’m kind of worried about you.',
            next: 'hard_steam'
          }
        ]
      },
      {
        label: 'hard_stay',
        moral: 'Great answer! It can be worrying to hear a friend use alcohol as a coping mechanism. Sometimes it feels hard to address it directly, but proposing alternatives can help. If you continue to be concerned, Yale has many resources, including your residential college Dean and FroCo, to help students who are stressed for any reason.'
      },
      {
        label: 'hard_dinner',
        moral: 'Good thinking! Parties can be fun, but often aren’t the best places for the kind of support it sounds like your friend is looking for. Making time with them beforehand to find out what’s going on can be a good way to check in and provide help they need.  If you feel that they need more, Yale has many resources, including your residential college Dean and FroCo, to help students who are stressed for any reason.'
      },
      {
        label: 'hard_steam',
        moral: 'Good thinking! Sometimes it’s good to share your concern out loud – you might be validating your friend’s own worries, and help them take positive steps. Those might include reaching out to some of Yale’s many resources, including your residential college Dean and FroCo, who are there to help students who are stressed for any reason.'
      }
    ])
  }

    // Reorder script
  if ($('#alc-learn--reorder').length) {
    // Hide the next button
    hideNext(0);

    $successMessage = $('#alc-learn--reorder__success');

    // Make the elements draggable
    var drake = dragula([document.getElementById('alc-learn--reorder__list')]);

    // On every drop, check for correct order, if good, allowNext
    drake.on('drop', function(el, target, source, sibling) {
      var listItems = $('#alc-learn--reorder__list').children();
      var currOrder = [];

      for (var i = 0; i < listItems.length; i++) {
        currOrder.push($(listItems[i]).data().order);
      }

      if (currOrder.toString() === currOrder.slice(0).sort().toString()) {
        $successMessage.fadeIn(allowNext)
      }
    });
  }

  if ($('#card').length) {
  	$("#card").flip();
  	$("#card2").flip();
   	$("#card3").flip();
    $("#card4").flip();

}

$("#card4").click(function() {
  allowNext();
});

hideNext();
// numberOfDivs();

window.onload = init;