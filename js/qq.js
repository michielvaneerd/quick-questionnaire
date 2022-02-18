(function() {

  function post(url, data) {
    var formData = new FormData();
    Object.keys(data).forEach(function(key) {
      formData.append(key, data[key]);
    });
    return fetch(url, {
      method: 'POST',
      cache: 'no-cache',
      body: formData
    }).then(function(response) {
      return response.json();
    });
  }

  var lists = document.querySelectorAll(".quick-questionnaire-enabled");
  var idCounter = 0;

  Array.prototype.forEach.call(lists, function(list) {

    var listId = list.dataset.qqId;

    var listItems = list.querySelectorAll("li[data-qq-item-id]");
    
    Array.prototype.forEach.call(listItems, function(li) {
      var listItemDataId = li.getAttribute("data-qq-item-id");
      var possibleAnswers = QQ_ANSWERS[listItemDataId];
      var type = possibleAnswers.options.type;
      switch (type) {
        case 'text':
        case 'itext':
        case 'reg':
          li.innerHTML = "<span>" + li.innerHTML + "</span><div class='qq-input-wrapper'><input class='qq-text' type='text' /></div>";
        break;
        case 'radio':
        case 'checkbox':
          var checkboxes = possibleAnswers.answers.map(function(answer) {
            idCounter += 1;
            var id = "a_" + idCounter;
            var inputEl = document.createElement("input");
            inputEl.className = "qq-" + type;
            inputEl.setAttribute("type", type);
            inputEl.setAttribute("name", listItemDataId + "[]");
            inputEl.id = id;
            inputEl.value = answer;
            var labelEl = document.createElement("label");
            labelEl.setAttribute("for", id);
            labelEl.appendChild(inputEl);
            var spanEl = document.createElement("span");
            spanEl.appendChild(document.createTextNode(answer));
            labelEl.appendChild(spanEl);
            return labelEl.outerHTML;
          });
          li.innerHTML = "<span>" + li.innerHTML + "</span><div class='qq-input-wrapper'>" + checkboxes.join("\n") + "</div>";
        break;
      }
    });

    var buttonDiv = document.createElement("p");
    buttonDiv.className = "qq-button-wrapper";
    var buttonCheck = document.createElement("button");
    buttonCheck.onclick = function() {

      buttonCheck.disabled = true;
      buttonCheck.className = "qq-in-request";

      var givenAnswers = {};
      givenAnswers[listId] = {};

      resetList(list);
      
      Array.prototype.forEach.call(listItems, function(li) {
        
        var questionId = li.getAttribute("data-qq-item-id");

        var textInput = li.querySelector("input.qq-text");
        if (textInput) {
          givenAnswers[listId][questionId] = textInput.value;
          return;
        }

        var radioInputs = li.querySelectorAll("input.qq-radio");
        if (radioInputs.length) {
          var checkedRadioInput = li.querySelector("input.qq-radio:checked");
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

        var checkboxInputs = li.querySelectorAll("input.qq-checkbox");
        if (checkboxInputs) {
          var checkedCheckboxInputs = li.querySelectorAll("input.qq-checkbox:checked");
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

      post(my_ajax_obj.ajax_url, {
        _ajax_nonce: my_ajax_obj.nonce,
        action: "qq_check",
        answers: JSON.stringify(givenAnswers),
        post_id: QQ_POST_ID
      }).then(function(data) {
        buttonCheck.disabled = false;
        buttonCheck.className = "";
        for (var questionId in data) {
          var li = list.querySelector("li[data-qq-item-id='" + questionId + "']");
          var textInput = li.querySelector("input[type='text']");
          li.className = data[questionId] ? "qq-goodquestion" : "qq-wrongquestion";
        }
      }).catch(function(error) {
        console.log(error);
        alert(JSON.stringify(error));
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

    if (list.dataset.qqShowButton) {
      var buttonGetAnswers = document.createElement("button");
      buttonGetAnswers.appendChild(document.createTextNode(my_ajax_obj.L.show));
      buttonGetAnswers.onclick = function() {
        buttonGetAnswers.disabled = true;
        buttonGetAnswers.className = "qq-in-request";
        post(my_ajax_obj.ajax_url, {
          _ajax_nonce: my_ajax_obj.nonce,
          action: "qq_show",
          list: listId,
          post_id: QQ_POST_ID
        }).then(function(data) {
          
            buttonGetAnswers.disabled = false;
            buttonGetAnswers.className = "";
            if ('success' in data && data.success === false) {
              alert('Not allowed');
              return;
            }
            var list = document.querySelector("[data-qq-id='" + listId + "']");
            Object.keys(data).forEach(function(listItemId) {
              var listItemInfo = data[listItemId];
              var listItem = list.querySelector("li[data-qq-item-id='" + listItemId + "']");
              switch (listItemInfo.type) {
                case 'text':
                case 'itext':
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
        }).catch(function(error) {
          console.log(error);
          alert(JSON.stringify(error));
        });
      };
      buttonDiv.appendChild(buttonGetAnswers);
    }

    list.insertBefore(buttonDiv, list.querySelector("li:last-child").nextSibling);

  });

  var resetList = function(list, removeAnswers) {
    Array.prototype.forEach.call(list.querySelectorAll(".qq-goodquestion, .qq-wrongquestion"), function(el) {
      el.className = "";
    });
    if (removeAnswers) {
      Array.prototype.forEach.call(list.querySelectorAll("input.qq-text, input.qq-checkbox, input.qq-radio"), function(input) {
        if (input.type === 'text') {
          input.value = "";
        } else {
          input.checked = false;
        }
      });
    }
  };

}());
