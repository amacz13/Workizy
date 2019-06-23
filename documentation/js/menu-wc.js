'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Workizy documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-5e2040eb723128611df444537a1e2c34"' : 'data-target="#xs-components-links-module-AppModule-5e2040eb723128611df444537a1e2c34"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-5e2040eb723128611df444537a1e2c34"' :
                                            'id="xs-components-links-module-AppModule-5e2040eb723128611df444537a1e2c34"' }>
                                            <li class="link">
                                                <a href="components/ChooseCoverFromSamplesPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ChooseCoverFromSamplesPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FirstStartPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FirstStartPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomePage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomePage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListViewerPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListViewerPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LocalListsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LocalListsPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MyApp.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MyApp</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NewItemPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NewItemPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NewListPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NewListPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OnlineListsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OnlineListsPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SettingsPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TabsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TabsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-5e2040eb723128611df444537a1e2c34"' : 'data-target="#xs-injectables-links-module-AppModule-5e2040eb723128611df444537a1e2c34"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-5e2040eb723128611df444537a1e2c34"' :
                                        'id="xs-injectables-links-module-AppModule-5e2040eb723128611df444537a1e2c34"' }>
                                        <li class="link">
                                            <a href="injectables/Encryption.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>Encryption</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FirebaseManager.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>FirebaseManager</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StorageManager.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>StorageManager</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserSettings.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserSettings</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UuidGenerator.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UuidGenerator</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ChooseCoverFromSamplesPageModule.html" data-type="entity-link">ChooseCoverFromSamplesPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ChooseCoverFromSamplesPageModule-aa9d9b1dade2070438ff708507652b57"' : 'data-target="#xs-components-links-module-ChooseCoverFromSamplesPageModule-aa9d9b1dade2070438ff708507652b57"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ChooseCoverFromSamplesPageModule-aa9d9b1dade2070438ff708507652b57"' :
                                            'id="xs-components-links-module-ChooseCoverFromSamplesPageModule-aa9d9b1dade2070438ff708507652b57"' }>
                                            <li class="link">
                                                <a href="components/ChooseCoverFromSamplesPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ChooseCoverFromSamplesPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/FirstStartPageModule.html" data-type="entity-link">FirstStartPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FirstStartPageModule-6ee11fe9bb7ac2b9a44c66aad7c8e29b"' : 'data-target="#xs-components-links-module-FirstStartPageModule-6ee11fe9bb7ac2b9a44c66aad7c8e29b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FirstStartPageModule-6ee11fe9bb7ac2b9a44c66aad7c8e29b"' :
                                            'id="xs-components-links-module-FirstStartPageModule-6ee11fe9bb7ac2b9a44c66aad7c8e29b"' }>
                                            <li class="link">
                                                <a href="components/FirstStartPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FirstStartPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ListViewerPageModule.html" data-type="entity-link">ListViewerPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ListViewerPageModule-d51c496ee4056f7e1cc0ff71c53b9b64"' : 'data-target="#xs-components-links-module-ListViewerPageModule-d51c496ee4056f7e1cc0ff71c53b9b64"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ListViewerPageModule-d51c496ee4056f7e1cc0ff71c53b9b64"' :
                                            'id="xs-components-links-module-ListViewerPageModule-d51c496ee4056f7e1cc0ff71c53b9b64"' }>
                                            <li class="link">
                                                <a href="components/ListViewerPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListViewerPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoginPageModule.html" data-type="entity-link">LoginPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LoginPageModule-b548317e8f80d55bfccc2702689d65a3"' : 'data-target="#xs-components-links-module-LoginPageModule-b548317e8f80d55bfccc2702689d65a3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoginPageModule-b548317e8f80d55bfccc2702689d65a3"' :
                                            'id="xs-components-links-module-LoginPageModule-b548317e8f80d55bfccc2702689d65a3"' }>
                                            <li class="link">
                                                <a href="components/LoginPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SettingsPageModule.html" data-type="entity-link">SettingsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SettingsPageModule-3ac7248082f9b1d3ff052b9f49f8dcfc"' : 'data-target="#xs-components-links-module-SettingsPageModule-3ac7248082f9b1d3ff052b9f49f8dcfc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SettingsPageModule-3ac7248082f9b1d3ff052b9f49f8dcfc"' :
                                            'id="xs-components-links-module-SettingsPageModule-3ac7248082f9b1d3ff052b9f49f8dcfc"' }>
                                            <li class="link">
                                                <a href="components/SettingsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SettingsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Checklist.html" data-type="entity-link">Checklist</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChecklistItem.html" data-type="entity-link">ChecklistItem</a>
                            </li>
                            <li class="link">
                                <a href="classes/Link.html" data-type="entity-link">Link</a>
                            </li>
                            <li class="link">
                                <a href="classes/List.html" data-type="entity-link">List</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListItem.html" data-type="entity-link">ListItem</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});