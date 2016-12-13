// ==UserScript==
// @name         Sat Channels
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://ru.kingofsat.net/*
// @grant        none
// ==/UserScript==
"use strict";

function Redirect()
{
  location.href = '/satellites.php';
}

function SatellitesPrepare()
{
  function HideControls(AHE)
  {
    for(var i = 0, LHE; i < document.body.children.length; ++i)
    {
      LHE = document.body.children[i];
      if(LHE !== AHE)
        LHE.style.display = 'none';
    }
  }

  function TablesPrepare(AHE)
  {
    var i, j;
    for(i = AHE.children.length - 1; i > 0; --i)
    {
      var LHE = AHE.children[i];
      if(LHE.tagName === 'BR')
        LHE.parentNode.removeChild(LHE);
      else
        LHE.style.display = 'none';
    }
    var LTableHEs = AHE.getElementsByTagName('table');
    var LFirstTBodyHE = LTableHEs[0].children[0];
    for(i = 1; i < LTableHEs.length; ++i)
    {
      var LTBodyHE = LTableHEs[i].children[0];
      for(j = 1; LTBodyHE.children.length > 1;)
        LFirstTBodyHE.appendChild(LTBodyHE.children[j]);
    }
    for(i = 0; i < LFirstTBodyHE.children.length; ++i)
    {
      var LTRHE = LFirstTBodyHE.children[i];
      if(i === 0)
        LTRHE.style.display = 'none';
      else
        for(j = 0; j < LTRHE.children.length; ++j)
        {
          var LTDHE = LTRHE.children[j];
          if((j === 0) || (j === 9))
          {
            LTDHE.setAttribute('width', '');
            if(LTDHE.children[0].pathname.substr(0, 5) === '/pos-')
            {
              var LCheckBoxHE = document.createElement('input');
              LCheckBoxHE.type = 'checkbox';
              LCheckBoxHE.addEventListener('change', SatProcess);
              LTDHE.insertBefore(LCheckBoxHE, LTDHE.children[0]);
            }
          }
          else
            LTDHE.style.display = 'none';
        }
    }
  }

  function SatProcess(AEvent)
  {
    TabCreate(AEvent.target, AEvent.target.nextSibling);
  }

  function TabContainerCreate(AHE)
  {
    var LTabContainerHE = document.body.appendChild(document.createElement('div'));
    var LTabHeaderHE    = LTabContainerHE.appendChild(document.createElement('div'));
    var LTabBodyHE      = LTabContainerHE.appendChild(document.createElement('div'));

    LTabContainerHE.style.border   = '1px solid red';
    LTabContainerHE.style.display  = 'fixed';
    LTabContainerHE.style.height   = (window.innerHeight - 2) + 'px';
    LTabContainerHE.style.left     = AHE.offsetWidth + 'px';
    LTabContainerHE.style.position = 'fixed';
    LTabContainerHE.style.top      = 0;
    LTabContainerHE.style.width    = (window.innerWidth - AHE.offsetWidth - 20) + 'px';

    LTabHeaderHE.style.backgroundColor = '#ccc';
    LTabHeaderHE.style.minHeight   = '15px';
    LTabHeaderHE.style.padding     = '2px 0';

    LTabBodyHE.style.height        = '100%';

    return {ContainerHE: LTabContainerHE, HeadHE: LTabHeaderHE, BodyHE: LTabBodyHE, Tabs: {}};
  }

  function TabCreate(ACBHE, AAHE)
  {
    var LTab = LTabs.Tabs[AAHE.href];
    if(!LTab)
    {
      LTab = {
        Active: false,
        BodyHE: LTabs.BodyHE.appendChild(document.createElement('iframe')),
        HeadHE: LTabs.HeadHE.appendChild(document.createElement('span')),
        Visible: false
      };
      LTab.HeadHE.innerHTML = AAHE.pathname.substr(1, AAHE.pathname.length - 5);
      LTab.HeadHE.style.cursor = 'pointer';
      LTab.HeadHE.style.padding = '0 5px';
      LTab.HeadHE.addEventListener('click', TabActiveSet.bind(null, LTab));
      LTab.BodyHE.src = AAHE.href;
      LTab.BodyHE.style.width = '100%';
      LTab.BodyHE.style.border = 'none';
      LTab.BodyHE.style.height = 'calc(100% - 15px)';

      LTabs.Tabs[AAHE.href] = LTab;
    }
    LTab.Visible = ACBHE.checked;
    LTab.HeadHE.style.display = LTab.Visible ? '' : 'none';
    TabActiveSet(LTab);
  }

  function TabActiveSet(ATab)
  {
    for(var LTabName in LTabs.Tabs)
    {
      var LTab = LTabs.Tabs[LTabName];
      LTab.Active = LTab === ATab;
      LTab.BodyHE.style.display = LTab.Active ? '' : 'none';
      LTab.HeadHE.style.color   = LTab.Active ? 'orange' : '';
    }
  }

  for(var i = 0; i < document.links.length; ++i)
    document.links[i].addEventListener('click', function(AEvent){ AEvent.preventDefault(); return false; });

  var LHE = document.getElementById('cbfreq');
  LHE.style.display = 'inline-block';
  HideControls(LHE);
  TablesPrepare(LHE);
  var LTabs = TabContainerCreate(LHE);
}

function ChannelsPrepare()
{
  function HideControls(AHEs)
  {
    var LHEs = Array.prototype.slice.apply(AHEs);
    for(var i = 0, LHE; i < document.body.children.length; ++i)
    {
      LHE = document.body.children[i];
      if((LHEs.indexOf(LHE) === -1) && (LHE.id.charAt(0) !== 'm'))
        LHE.style.display = 'none';
    }
  }

  function SatHide(AHE)
  {
    AHE.style.display = 'none';
    AHE.nextElementSibling.style.display = 'none';
  }

  function SatInfoProcess(ATableHE, ATRHE)
  {
    var LResult = ATRHE.children[6].textContent === 'DVB-S';
    if(LResult)
    {
      ATableHE.style.width = 'inherit';
      ATableHE.style.border = '0';
      ATRHE.style.backgroundColor = 'transparent';
      for(var i = ATRHE.children.length - 1, LTDHE; i >= 0; --i)
      {
        LTDHE = ATRHE.children[i];
        if([1, 2, 3, 8].indexOf(i) === -1)
          ATRHE.removeChild(LTDHE);
        else
          LTDHE.width = '';
      }
    }
    else
      SatHide(ATableHE);
    return LResult;
  }

  function ChannelsProcess(ATableHE, AHE)
  {
    var LTRHEs = AHE.getElementsByTagName('tr');
    var LCount = LTRHEs.length;
    var i, j, LTRHE, LTDHE, LCharCode;
    for(i = 0, LTRHE; i < LTRHEs.length; ++i)
    {
      LTRHE = LTRHEs[i];
      if((LTRHE.textContent.indexOf('Occasional Feeds, data or inactive frequency') !== -1) ||
         (LTRHE.children[0].className !== 'v') ||
         (['BISS', 'Открытый'].indexOf(LTRHE.children[6].textContent) === -1) ||
         !(
           (LTRHE.children[3].textContent === 'Украина') || (LTRHE.children[9].textContent.indexOf('ukr') !== -1) /*||
           (LTRHE.children[3].textContent === 'Россия') || (LTRHE.children[9].textContent.indexOf('rus') !== -1) ||
           (LTRHE.children[3].textContent === 'Польша') || (LTRHE.children[9].textContent.indexOf('pol') !== -1)*/
         )
      )
      {
        LTRHE.style.display = 'none';
        LCount--;
      }
      if(LTRHE.children[9])
      {
        var LText = LTRHE.children[9].textContent;
        LTRHE.children[9].innerHTML = '';
        for(j = 0, LCharCode; j < LText.length; ++j)
        {
          LCharCode = LText.charCodeAt(j);
          if((LCharCode === 32) || ((LCharCode >= 97) && (LCharCode <= 122)))
            LTRHE.children[9].innerHTML += LText.charAt(j);
        }
      }
      for(j = LTRHE.children.length - 1, LTDHE; j >= 0; --j)
      {
        LTDHE = LTRHE.children[j];
        if([2, 3, 4, 6, 9].indexOf(j) === -1)
          LTRHE.removeChild(LTDHE);
      }
    }
    if(LCount === 0)
      SatHide(ATableHE);
  }

  var LHEs = document.querySelectorAll('table.frq');
  HideControls(LHEs);

  for(var i = 0, LHE; i < LHEs.length; ++i)
  {
    LHE = LHEs[i];
    if(SatInfoProcess(LHE, LHE.getElementsByTagName('tr')[0]))
      ChannelsProcess(LHE, LHE.nextElementSibling);
  }
}

/*if(location.pathname === '/')
  Redirect();
else*/
if(location.pathname === '/satellites.php')
  SatellitesPrepare();
if((location.pathname.substr(0, 5) === '/pos-') || (location.pathname.substr(0, 5) === '/sat-'))
  ChannelsPrepare();