import React from 'react';
import { Link } from 'react-router-dom';

import { ActionButton } from '../common/components/Buttons';
import checklistPNG from '../assets/checklist.png'
import checklistRunsPNG from '../assets/checklist-runs.png'
import Title from '../common/components/Title';
import Subtitle from '../common/components/Subtitle';
import Icon from '../common/components/Icon';

export default function Onboarding() {
  return (
    <div className="View ChecklistListView Onboarding" >
      <div className="TitleContainer">
        <Title>
          Welcome, you productivity god!
        </Title>
        <Subtitle>
          Our brain is fantastic at generating ideas, but terrible at storing them.
        </Subtitle>
      </div>
      <div>
        <Link to="/checklists/new/" className="Step">
          <div>
            <img src={checklistPNG} className="OnboardingImage" />
          </div>
          <div>
            <p className="OnboardingDescriptionTitleText">
              Create a reusable checklist template <strong>once</strong>
            </p>
            <p className="OnboardingDescriptionSubtitleText">
              Think of things you do daily, weekly, monthly or even irregulary
            </p>
          </div>
        </Link>
        <Link to="/checklists/new/" className="Step">
          <div>
            <img src={checklistRunsPNG} className="OnboardingImage" />
          </div>
          <div>
            <p className="OnboardingDescriptionTitleText">
              Run it <strong>multiple times</strong>
            </p>
            <p className="OnboardingDescriptionSubtitleText">
              Checklists are meant to help you follow the same steps over and over again
            </p>
          </div>
        </Link>
        <div className="ButtonContainer">
          <Link to="/checklists/new/">
            <ActionButton>
              <Icon icon="plus" />
              <span className="AlwaysShow">Create my first checklist</span>
            </ActionButton>
          </Link>
        </div>
      </div>
    </div>
  )
}