import { CheckboxControl, Button, Modal, TextControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';


export const MyModal = (props) => {

    const { title, answers, setAnswers, question, setQuestion, onModalClose, closeModal, type } = props;

    function updateAnswer(index, newValue) {
        let newAnswers = [...answers];
        newAnswers[index] = newValue;
        setAnswers(newAnswers);
    }

    return <Modal title={title} onRequestClose={closeModal}>
        <TextControl label="Question" value={question} onChange={(value) => setQuestion(value)} />
        {answers.map((answer, index) => <TextControl key={index} value={answer} onChange={(value) => { updateAnswer(index, value); }} />)}
        <Button onClick={() => setAnswers(answers.concat(''))}>Click</Button>
        <Button onClick={onModalClose}>OK</Button>
    </Modal>;
}