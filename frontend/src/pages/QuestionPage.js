import React from 'react';

import GlobalNavbar from '../components/GlobalNavbar';
import QuestionList from '../components/QuestionList';
import ChooseAnswer from '../components/ChooseAnswer';

const QuestionPage = () => {
    return (
        <div>
            <GlobalNavbar />
            <ChooseAnswer />
            <QuestionList />
        </div>
    );
}

export default QuestionPage;
