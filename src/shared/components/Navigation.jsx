import { useId, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { GenericCloseTiny, GenericMenuLow } from '@visa/nova-icons-react'
import {
  Button,
  DropdownButton,
  Link,
  Nav,
  NavAppName,
  Tab,
  Tabs,
  Typography,
  Utility,
  UtilityFragment,
} from '@visa/nova-react'

import { selectSelectedProject } from '../../store/projectSlice.js'

export const Navigation = () => {
  const id = useId()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const selectedProject = useSelector(selectSelectedProject)

  const onToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const tabs = (
    <>
      <Tab>
        <Button
          buttonSize="large"
          colorScheme="tertiary"
          aria-current={location.pathname.endsWith('/') ? 'page' : undefined}
          element={<a href="./">Projects</a>}
        />
      </Tab>
      {selectedProject && (
        <Tab>
          <Button
            buttonSize="large"
            colorScheme="tertiary"
            aria-current={location.pathname.endsWith('/sources') ? 'page' : undefined}
            element={<a href="./sources">Sources</a>}
          />
        </Tab>
      )}
      {selectedProject?.files?.length > 0 && (
        <>
          <Tab>
            <Button
              buttonSize="large"
              colorScheme="tertiary"
              aria-current={location.pathname.endsWith('/processing') ? 'page' : undefined}
              element={<a href="./processing">Processing</a>}
            />
          </Tab>
          <Tab>
            <Button
              buttonSize="large"
              colorScheme="tertiary"
              aria-current={location.pathname.endsWith('/results') ? 'page' : undefined}
              element={<a href="./results">Results</a>}
            />
          </Tab>
        </>
      )}
    </>
  )

  return (
    <div>
      <Link alternate skipLink href="#content">
        Skip to content
      </Link>
      <UtilityFragment vJustifyContent="between">
        <Nav
          id={id}
          alternate
          orientation="horizontal"
          tag="header"
        >
          <>
            <UtilityFragment vContainerHide="desktop">
              <DropdownButton
                aria-controls={`${id}-mobile-menu`}
                aria-expanded={mobileMenuOpen ? 'true' : 'false'}
                aria-describedby={`${id}-mobile-menu-notifications-badge`}
                aria-label="open menu"
                buttonSize="large"
                colorScheme="tertiary"
                iconButton
                id={`${id}-mobile-menu-button`}
                onClick={onToggleMobileMenu}
              >
                {mobileMenuOpen ? (
                  <GenericCloseTiny />
                ) : (
                  <>
                    <GenericMenuLow />
                  </>
                )}
              </DropdownButton>
            </UtilityFragment>
            <UtilityFragment vFlex vGap={16}>
              <Link
                aria-label="Application Name Home"
                href="./projects"
                id={`${id}-home-link`}
                noUnderline
                style={{ backgroundColor: 'transparent' }}
              >
                <NavAppName>
                  <Utility
                    vContainerHide="xs"
                    element={<Typography variant="headline-3">Pixels</Typography>}
                  />
                </NavAppName>
              </Link>
            </UtilityFragment>
            <UtilityFragment
              vFlex
              vJustifyContent="end"
              vFlexGrow
              vMarginLeft="auto"
              vContainerHide="mobile"
            >
              <nav aria-label="Label for alternate horizontal example with active element">
                <UtilityFragment vGap={4}>
                  <Tabs>
                    {tabs}
                  </Tabs>
                </UtilityFragment>
              </nav>
            </UtilityFragment>
          </>
        </Nav>
      </UtilityFragment>
      <UtilityFragment vContainerHide="desktop" vHide={!mobileMenuOpen}>
        <Nav
          alternate
          aria-label="Label for alternate horizontal example with active element"
          aria-hidden={!mobileMenuOpen}
          id={`${id}-mobile-menu`}
          orientation="vertical"
        >
          <Tabs orientation="vertical">
            {tabs}
          </Tabs>
        </Nav>
      </UtilityFragment>
    </div>
  )
}
