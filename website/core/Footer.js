/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className='nav-footer' id='footer'>
        <section className='sitemap'>
          <a href={this.props.config.baseUrl} className='nav-home'>
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width='66'
                height='58'
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a
              href={this.docUrl(
                'getting-started/introduction',
                this.props.language
              )}
            >
              Getting Started
            </a>
            <a href={this.docUrl('guides/deployment', this.props.language)}>
              Guides
            </a>
            <a
              href={this.docUrl(
                'contributing/contributing',
                this.props.language
              )}
            >
              Contributing
            </a>
          </div>
          <div>
            <h5>Community</h5>
            <a href='https://www.minds.com/groups/profile/365903183068794880/feed'>
              Open Source Community Group
            </a>
            <a
              href='https://stackoverflow.com/questions/tagged/'
              target='_blank'
              rel='noreferrer noopener'
            >
              Stack Overflow
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href='https://gitlab.com/minds'>GitLab</a>
            <span></span>
            <a
              className='github-button'
              href='https://github.com/minds/minds'
              data-icon='octicon-star'
              data-size='large'
              data-show-count='true'
              aria-label='Star minds/minds on GitHub'
            >
              Star
            </a>
          </div>
        </section>

        <section className='copyright'>{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
