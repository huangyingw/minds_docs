/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = '' } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className='homeContainer'>
        <div className='homeSplashFade'>
          <div className='wrapper homeWrapper'>{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className='projectLogo'>
        <img src={props.img_src} alt='Project Logo' />
      </div>
    );

    const ProjectTitle = () => (
      <h2 className='projectTitle'>
        Free & Open Source
        <small>The Minds.com Stack</small>
      </h2>
    );

    const PromoSection = props => (
      <div className='section promoSection'>
        <div className='promoRow'>
          <div className='pluginRowBlock'>{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className='pluginWrapper buttonWrapper'>
        <a className='button' href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className='inner'>
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href='docs/getting-started/installation'>
              Get Started
            </Button>
            <Button href='docs/getting-started/introduction'>
              Read the Docs
            </Button>
            <Button href='https://gitlab.com/minds'>View the Code</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = '' } = this.props;
    const { baseUrl } = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}
      >
        <GridBlock
          align='center'
          contents={props.contents}
          layout={props.layout}
        />
      </Container>
    );

    const KeyFeatures = () => (
      <Block
        id='features'
        layout='twoColumn'
        contents={[
          {
            title: 'A modern stack, designed to scale',
            content:
              'Kubernetes & Docker keep everyone on the same page ' +
              'and allow for seamless scalability, along with high performance NoSQL ' +
              'databases, Cassandra & ElasticSearch.'
          },
          {
            title: 'We have a full set of features',
            content:
              'Newsfeeds, images, videos, groups, blockchain-based rewards system' +
              ' video chat, notifications and more!'
          }
        ]}
      ></Block>
    );

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className='mainContainer'>
          <KeyFeatures />
        </div>
      </div>
    );
  }
}

module.exports = Index;
