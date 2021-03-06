(function(win, $) {

  var lists = document.querySelectorAll(".easy_exercise-list");
  var idCounter = 0;

  Array.prototype.forEach.call(lists, function(list) {

    var listId = list.getAttribute("data-easy_exercise-list-id");

    var listItems = list.querySelectorAll("li[data-easy_exercise-item-id]");
    
    Array.prototype.forEach.call(listItems, function(li) {
      var listItemDataId = li.getAttribute("data-easy_exercise-item-id");
      var possibleAnswers = EASY_EXERCISE_ANSWERS[listItemDataId];
      var type = possibleAnswers.options.type;
      switch (type) {
        case 'text':
        case 'reg':
          li.innerHTML = li.innerHTML + "<div class='easy_exercise_input_wrapper'><input class='easy_exercise_text' type='text' /></div>";
        break;
        case 'radio':
        case 'checkbox':
          var checkboxes = possibleAnswers.answers.map(function(answer) {
            idCounter += 1;
            var id = "a_" + idCounter;
            var inputEl = $("<input class='easy_exercise_" + type + "' type='" + type + "' name='" + listItemDataId + "[]' id='" + id + "' />");
            inputEl.attr('value', answer);
            var labelEl = $("<label for='" + id + "'>").append(inputEl);
            labelEl.append("<span>" + answer + "</span>");
            return labelEl[0].outerHTML;
          });
          li.innerHTML = li.innerHTML + "<div class='easy_exercise_input_wrapper'>" + checkboxes.join("\n") + "</div>";
        break;
      }
    });

    var buttonDiv = document.createElement("p");
    buttonDiv.className = "easy_exercise-button-wrapper";
    var buttonCheck = document.createElement("button");
    buttonCheck.onclick = function() {

      buttonCheck.disabled = true;
      buttonCheck.className = "easy_exercise_in_request";

      var givenAnswers = {};
      givenAnswers[listId] = {};

      resetList(list);
      
      Array.prototype.forEach.call(listItems, function(li) {
        
        var questionId = li.getAttribute("data-easy_exercise-item-id");

        var textInput = li.querySelector("input.easy_exercise_text");
        if (textInput) {
          givenAnswers[listId][questionId] = textInput.value;
          return;
        }

        var radioInputs = li.querySelectorAll("input.easy_exercise_radio");
        if (radioInputs.length) {
          var checkedRadioInput = li.querySelector("input.easy_exercise_radio:checked");
          if (!(questionId in givenAnswers[listId])) {
            givenAnswers[listId][questionId] = [];
          }
          if (checkedRadioInput) {
            givenAnswers[listId][questionId].push(checkedRadioInput.parentNode.innerText);
          } else {
            givenAnswers[listId][questionId] = null;
          }
          return;
        }

        var checkboxInputs = li.querySelectorAll("input.easy_exercise_checkbox");
        if (checkboxInputs) {
          var checkedCheckboxInputs = li.querySelectorAll("input.easy_exercise_checkbox:checked");
          if (!(questionId in givenAnswers[listId])) {
            givenAnswers[listId][questionId] = [];
          }
          if (checkedCheckboxInputs.length) {
            Array.prototype.forEach.call(checkedCheckboxInputs, function(checkbox) {
              givenAnswers[listId][questionId].push(checkbox.parentNode.innerText);
            });
          } else {
            givenAnswers[listId][questionId] = null;
          }
          return;
        }
        
      });

      $.post(my_ajax_obj.ajax_url, {
        _ajax_nonce: my_ajax_obj.nonce,
        action: "easy_exercise_check",
        answers: JSON.stringify(givenAnswers),
        post_id: EASY_EXERCISE_POST_ID
      }, function(data) {
        buttonCheck.disabled = false;
        buttonCheck.className = "";
        for (var questionId in data) {
          var li = list.querySelector("li[data-easy_exercise-item-id='" + questionId + "']");
          var textInput = li.querySelector("input[type='text']");
          li.className = data[questionId] ? "easy_exercise-goodquestion" : "easy_exercise-wrongquestion";
        }
      });

    };
    buttonCheck.appendChild(document.createTextNode(my_ajax_obj.L.check));
    buttonDiv.appendChild(buttonCheck);
    
    var buttonReset = document.createElement("button");
    buttonReset.appendChild(document.createTextNode(my_ajax_obj.L.reset));
    buttonReset.onclick = function() {
      resetList(list, true);
    };
    buttonDiv.appendChild(buttonReset);

    if (EASY_EXERCISE_SHOW_BUTTON) {
      var buttonGetAnswers = document.createElement("button");
      buttonGetAnswers.appendChild(document.createTextNode(my_ajax_obj.L.show));
      buttonGetAnswers.onclick = function() {
        buttonGetAnswers.disabled = true;
        buttonGetAnswers.className = "easy_exercise_in_request";
        $.post(my_ajax_obj.ajax_url, {
          _ajax_nonce: my_ajax_obj.nonce,
          action: "easy_exercise_show",
          list: listId,
          post_id: EASY_EXERCISE_POST_ID
        }, function(data) {
          buttonGetAnswers.disabled = false;
          buttonGetAnswers.className = "";
          if ('success' in data && data.success === false) {
            alert('Not allowed');
            return;
          }
          var list = document.querySelector("[data-easy_exercise-list-id='" + listId + "']");
          Object.keys(data).forEach(function(listItemId) {
            var listItemInfo = data[listItemId];
            var listItem = list.querySelector("li[data-easy_exercise-item-id='" + listItemId + "']");
            switch (listItemInfo.type) {
              case 'text':
                listItem.querySelector("input[type='text']").value = listItemInfo.answers.join(', ');
              break;
              case 'reg':
                listItem.querySelector("input[type='text']").value = listItemInfo.answers;
              break;
              default:
              Array.prototype.forEach.call(listItem.querySelectorAll('input'), function(input) {
                input.checked = listItemInfo.answers.indexOf(input.value) !== -1;
              });
              break;
            }
          });
          
        });
      };
      buttonDiv.appendChild(buttonGetAnswers);
    }

    list.insertBefore(buttonDiv, list.querySelector("li:last-child").nextSibling);

  });

  var resetList = function(list, removeAnswers) {
    Array.prototype.forEach.call(list.querySelectorAll(".easy_exercise-goodquestion, .easy_exercise-wrongquestion"), function(el) {
      el.className = "";
    });
    if (removeAnswers) {
      Array.prototype.forEach.call(list.querySelectorAll("input.easy_exercise_text, input.easy_exercise_checkbox, input.easy_exercise_radio"), function(input) {
        if (input.type === 'text') {
          input.value = "";
        } else {
          input.checked = false;
        }
      });
    }
  };

}(this, jQuery));
