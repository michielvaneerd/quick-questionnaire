import { CheckboxControl, Button, Modal, TextControl } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';

const multipleAnswersTypes = ['checkbox', 'radio'];

export const MyModal = (props) => {

    const { title, answers, setAnswers, question, setQuestion, onModalClose, closeModal, type } = props;

    function updateAnswer(index, newValue) {
        let newAnswers = [...answers];
        newAnswers[index] = newValue;
        setAnswers(newAnswers);
    }

    return <Modal title={title} onRequestClose={closeModal}>
        <TextControl autoFocus={question === '' || answers.length === 0} label="Question" value={question} onChange={(value) => setQuestion(value)} />
        {answers.map((answer, index) => <TextControl autoFocus={question !== '' && index === answers.length - 1} key={index} value={answer} onChange={(value) => { updateAnswer(index, value); }} />)}
        {multipleAnswersTypes.indexOf(type) !== -1 && <Button onClick={() => setAnswers(answers.concat(''))}>Click</Button>}
        <Button onClick={onModalClose}>OK</Button>
    </Modal>;
}