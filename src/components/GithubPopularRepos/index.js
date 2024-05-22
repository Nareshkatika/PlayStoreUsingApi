import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const GithubPopularRepos = () => {
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [repositoriesData, setRepositoriesData] = useState([])
  const [activeLanguageFilterId, setActiveLanguageFilterId] = useState(
    languageFiltersData[0].id,
  )

  const getRepositories = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activeLanguageFilterId}`
    const response = await fetch(apiUrl)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.popular_repos.map(eachRepository => ({
        id: eachRepository.id,
        imageUrl: eachRepository.avatar_url,
        name: eachRepository.name,
        starsCount: eachRepository.stars_count,
        forksCount: eachRepository.forks_count,
        issuesCount: eachRepository.issues_count,
      }))
      setRepositoriesData(updatedData)
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getRepositories()
  }, [activeLanguageFilterId])

  const renderLoadingView = () => (
    <div data-testid="loader">
      <Loader color="#0284c7" height={80} type="ThreeDots" width={80} />
    </div>
  )

  const renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="error-message">Something Went Wrong</h1>
    </div>
  )

  const renderRepositoriesListView = () => (
    <ul className="repositories-list">
      {repositoriesData.map(eachRepository => (
        <RepositoryItem
          key={eachRepository.id}
          repositoryDetails={eachRepository}
        />
      ))}
    </ul>
  )

  const renderRepositories = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderRepositoriesListView()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  const handleLanguageFilterClick = newFilterId => {
    setActiveLanguageFilterId(newFilterId)
  }

  const renderLanguageFiltersList = () => (
    <ul className="filters-list">
      {languageFiltersData.map(eachLanguageFilter => (
        <LanguageFilterItem
          key={eachLanguageFilter.id}
          isActive={eachLanguageFilter.id === activeLanguageFilterId}
          languageFilterDetails={eachLanguageFilter}
          setActiveLanguageFilterId={handleLanguageFilterClick}
        />
      ))}
    </ul>
  )

  return (
    <div className="app-container">
      <div className="responsive-container">
        <h1 className="heading">Popular</h1>
        {renderLanguageFiltersList()}
        {renderRepositories()}
      </div>
    </div>
  )
}

export default GithubPopularRepos
