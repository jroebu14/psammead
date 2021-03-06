import React from 'react';
import styled from '@emotion/styled';
import { GEL_GROUP_3_SCREEN_WIDTH_MIN } from '@bbc/gel-foundations/breakpoints';
import { GEL_SPACING, GEL_SPACING_DBL } from '@bbc/gel-foundations/spacings';
import { grid } from '@bbc/psammead-styles/detection';
import Grid from '@bbc/psammead-grid';
import {
  arrayOf,
  elementType,
  number,
  oneOf,
  shape,
  string,
  oneOfType,
} from 'prop-types';
import { scriptPropType } from '@bbc/gel-foundations/prop-types';
import ProgramCard from './ProgramCard';
import StartTime from './StartTime';

const StartTimeWrapper = styled.div`
  padding-bottom: ${GEL_SPACING};
`;

// Reset default of <ul> style
const StyledGrid = styled(Grid)`
  padding: 0;
  margin: 0;
  @media (max-width: ${GEL_GROUP_3_SCREEN_WIDTH_MIN}) {
    padding: 0;
  }
`;

// Using flex-box on browsers that do not support grid will break grid fallback defined in psammead-grid
const StyledFlexGrid = styled(Grid)`
  @supports (${grid}) {
    display: flex;
    flex-direction: column;
  }
  position: relative;
  padding-bottom: ${GEL_SPACING_DBL};
`;

const renderSchedule = ({
  service,
  script,
  dir,
  timezone,
  locale,
  program,
  nextLabel,
  liveLabel,
  durationLabel,
  linkComponent,
  linkComponentAttr,
}) => {
  const { state, startTime, link, brandTitle, summary, duration } = program;

  return (
    <>
      <StartTimeWrapper>
        <StartTime
          timestamp={startTime}
          service={service}
          script={script}
          locale={locale}
          timezone={timezone}
          dir={dir}
        />
      </StartTimeWrapper>
      <ProgramCard
        duration={duration}
        summary={summary}
        durationLabel={durationLabel}
        service={service}
        script={script}
        dir={dir}
        brandTitle={brandTitle}
        startTime={startTime}
        state={state}
        link={link}
        nextLabel={nextLabel}
        liveLabel={liveLabel}
        timezone={timezone}
        locale={locale}
        linkComponent={linkComponent}
        linkComponentAttr={linkComponentAttr}
      />
    </>
  );
};

const schedulesGridProps = {
  enableGelGutters: true,
  columns: {
    group0: 4,
    group1: 4,
    group2: 6,
    group3: 6,
    group4: 8,
    group5: 8,
  },
  margins: {
    group0: true,
    group1: true,
    group2: true,
  },
};

const programGridProps = {
  item: true,
  columns: {
    group0: 4,
    group1: 4,
    group2: 6,
    group3: 3,
    group4: 2,
    group5: 2,
  },
};

/*
Currently, we are passing a list of schedules to this component and mapping
through the list to render a star-time and program-card, inside a gird.
We intend to move the map functionality out of psammead in a future iteration.
*/
const RadioSchedule = ({ schedules, dir, ...props }) => (
  <StyledGrid forwardedAs="ul" dir={dir} {...schedulesGridProps} role="list">
    {schedules.map(({ id, ...program }) => (
      <StyledFlexGrid
        dir={dir}
        parentColumns={schedulesGridProps.columns}
        parentEnableGelGutters
        {...programGridProps}
        key={id}
        as="li"
        data-e2e={program.state}
        role="listitem"
      >
        {renderSchedule({ ...props, dir, program })}
      </StyledFlexGrid>
    ))}
  </StyledGrid>
);

const programPropTypes = shape({
  state: string.isRequired,
  startTime: number.isRequired,
  link: string.isRequired,
  brandTitle: string.isRequired,
  summary: string,
  duration: string.isRequired,
});

const sharedProps = {
  timezone: string,
  locale: string,
  service: string.isRequired,
  script: shape(scriptPropType).isRequired,
  nextLabel: string.isRequired,
  liveLabel: string.isRequired,
  durationLabel: string.isRequired,
  dir: oneOf(['rtl', 'ltr']),
};

renderSchedule.propTypes = {
  program: programPropTypes.isRequired,
  ...sharedProps,
  linkComponent: oneOfType([elementType, string]),
  linkComponentAttr: string,
};

renderSchedule.defaultProps = {
  linkComponent: 'a',
  linkComponentAttr: 'href',
};

RadioSchedule.propTypes = {
  schedules: arrayOf(programPropTypes).isRequired,
  ...sharedProps,
  linkComponent: oneOfType([elementType, string]),
  linkComponentAttr: string,
};

/* eslint-disable react/default-props-match-prop-types */
RadioSchedule.defaultProps = {
  dir: 'ltr',
  timezone: 'Europe/London',
  locale: 'en-gb',
  linkComponent: 'a',
  linkComponentAttr: 'href',
};

export default RadioSchedule;
