(function(win, $) {

  var lists = document.querySelectorAll(".quick_questionnaire-list");
  var idCounter = 0;

  Array.prototype.forEach.call(lists, function(list) {

    var listId = list.getAttribute("data-quick_questionnaire-list-id");

    var listItems = list.querySelectorAll("li[data-quick_questionnaire-item-id]");
    
    Array.prototype.forEach.call(listItems, function(li) {
      var listItemDataId = li.getAttribute("data-quick_questionnaire-item-id");
      var possibleAnswers = QUICK_QUESTIONNAIRE_ANSWERS[listItemDataId];
      var type = possibleAnswers.options.type;
      switch (type) {
        case 'text':
        case 'reg':
          li.innerHTML = li.innerHTML + "<div class='quick_questionnaire_input_wrapper'><input class='quick_questionnaire_text' type='text' /></div>";
        break;
        case 'radio':
        case 'checkbox':
          var checkboxes = possibleAnswers.answers.map(function(answer) {
            idCounter += 1;
            var id = "a_" + idCounter;
            var inputEl = $("<input class='quick_questionnaire_" + type + "' type='" + type + "' name='" + listItemDataId + "[]' id='" + id + "' />");
            inputEl.attr('value', answer);
            var labelEl = $("<label for='" + id + "'>").append(inputEl);
            labelEl.append("<span>" + answer + "</span>");
            return labelEl[0].outerHTML;
          });
          li.innerHTML = li.innerHTML + "<div class='quick_questionnaire_input_wrapper'>" + checkboxes.join("\n") + "</div>";
        break;
      }
    });

    var buttonDiv = document.createElement("p");
    buttonDiv.className = "quick_questionnaire-button-wrapper";
    var buttonCheck = document.createElement("button");
    buttonCheck.onclick = function() {

      buttonCheck.disabled = true;
      buttonCheck.className = "quick_questionnaire_in_request";

      var givenAnswers = {};
      givenAnswers[listId] = {};

      resetList(list);
      
      Array.prototype.forEach.call(listItems, function(li) {
        
        var questionId = li.getAttribute("data-quick_questionnaire-item-id");

        var textInput = li.querySelector("input.quick_questionnaire_text");
        if (textInput) {
          givenAnswers[listId][questionId] = textInput.value;
          return;
        }

        var radioInputs = li.querySelectorAll("input.quick_questionnaire_radio");
        if (radioInputs.length) {
          var checkedRadioInput = li.querySelector("input.quick_questionnaire_radio:checked");
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

        var checkboxInputs = li.querySelectorAll("input.quick_questionnaire_checkbox");
        if (checkboxInputs) {
          var checkedCheckboxInputs = li.querySelectorAll("input.quick_questionnaire_checkbox:checked");
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
        action: "quick_questionnaire_check",
        answers: JSON.stringify(givenAnswers),
        post_id: QUICK_QUESTIONNAIRE_POST_ID
      }, function(data) {
        buttonCheck.disabled = false;
        buttonCheck.className = "";
        for (var questionId in data) {
          var li = list.querySelector("li[data-quick_questionnaire-item-id='" + questionId + "']");
          var textInput = li.querySelector("input[type='text']");
          li.className = data[questionId] ? "quick_questionnaire-goodquestion" : "quick_questionnaire-wrongquestion";
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

    if (QUICK_QUESTIONNAIRE_SHOW_BUTTON) {
      var buttonGetAnswers = document.createElement("button");
      buttonGetAnswers.appendChild(document.createTextNode(my_ajax_obj.L.show));
      buttonGetAnswers.onclick = function() {
        buttonGetAnswers.disabled = true;
        buttonGetAnswers.className = "quick_questionnaire_in_request";
        $.post(my_ajax_obj.ajax_url, {
          _ajax_nonce: my_ajax_obj.nonce,
          action: "quick_questionnaire_show",
          list: listId,
          post_id: QUICK_QUESTIONNAIRE_POST_ID
        }, function(data) {
          buttonGetAnswers.disabled = false;
          buttonGetAnswers.className = "";
          if ('success' in data && data.success === false) {
            alert('Not allowed');
            return;
          }
          var list = document.querySelector("[data-quick_questionnaire-list-id='" + listId + "']");
          Object.keys(data).forEach(function(listItemId) {
            var listItemInfo = data[listItemId];
            var listItem = list.querySelector("li[data-quick_questionnaire-item-id='" + listItemId + "']");
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
    Array.prototype.forEach.call(list.querySelectorAll(".quick_questionnaire-goodquestion, .quick_questionnaire-wrongquestion"), function(el) {
      el.className = "";
    });
    if (removeAnswers) {
      Array.prototype.forEach.call(list.querySelectorAll("input.quick_questionnaire_text, input.quick_questionnaire_checkbox, input.quick_questionnaire_radio"), function(input) {
        if (input.type === 'text') {
          input.value = "";
        } else {
          input.checked = false;
        }
      });
    }
  };

}(this, jQuery));
