// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.28;

contract ProjectFunding {

    struct Project {
        uint256 project_id;
        string project_name;
        string project_goal;
        uint256 project_fund;
        address project_address;
        bool isApprove;
        uint256 project_timestamp;
        ProjectMilestone[] milestones;
    }

    enum ProjectMilestoneStatus { inProgress, aboutToFinish, Finished}

    struct ProjectMilestone {
        uint miles_id;
        string project_milestone_description;
        uint milestone_percentage;
        ProjectMilestoneStatus project_status;
        bool isReleased;
        uint256 votingDeadLine;
    }


    struct Creator {
        uint256 creator_id;
        string creator_name;
        address creator_address;
    } // yes i want to display creators

    mapping(uint256 => Project) public projects; // to map id to projects

    mapping(uint256 => mapping(address => uint256))  public contributions; //this is to map project id to baker address 

    mapping (address => bool) public isCreator;

    mapping (address => address[]) public backers;

    Creator[] public creators;

    mapping(uint256 => mapping(uint256 => mapping(address => bool))) public votes;

    address public admin;

    uint256 public projectCount;

    uint256 public constant VOTING_PERIOD = 7 days;

    constructor (address _adminAddress) {
        admin = _adminAddress;
    }

    modifier onlyAdmin () {
        require(admin == msg.sender, "Only Admin can perform this operation");
        _;
    }

    modifier onlyProjectCreator(uint256 _project_id) {
        require(msg.sender == projects[_project_id].project_address, "Only Creator can perform this operation");
        _;
    }

    modifier onlyBacker (uint256 _project_id) {
        require(contributions[_project_id][msg.sender] > 0, "Only Backer can perform this Operations");
        _;
    }

    modifier projectExist (uint256 _project_id) {
        require(_project_id < projectCount, "Project does not exist");
        _;
    }

    modifier deadLineBefore (uint256 _project_id) {
        require(block.timestamp < projects[_project_id].project_timestamp, "Project does not exist");
        _;
    }

    event ProjectCreated (uint256 projectId, address project_address, string project_name, string project_goal, uint256 deadline);
    event ContributionMade(uint256 projectId, address backer, uint256 project_fund);
    event MilestoneSubmitted(uint256 projectId, uint256 miles_Id, address creator_address);
    event VoteCast(uint256 projectId, uint256 miles_Id, address backer,bool isApprove);
    event MilestoneApproved(uint256 projectId, uint256 miles_Id);
    event FundsReleased(uint256 projectId, uint256 milestoneId, uint256 project_fund);
    event RefundIssued(uint256 projectId, address backer, uint256 project_fund);
    event ProjectCanceled(uint256 projectId);

    //signor1

    // this function is to create a creator
    function become_a_creator (
        string memory _creator_name,
        address _creator_address
    ) onlyProjectCreator external {
        uid = creator_id + 1;

        Creator memory new_creator_ = Creator(uid, _creator_name, _creator_address);

        creators.push(new_creator_);

        isCreator[_creator_address] = true;
    }

    // this function is to create a project
    function create_project(
        string memory _project_name,
        string memory _project_goal,
        uint256 _project_fund,
        uint256 _project_timestamp,
        ProjectMilestone[] memory _initialMilestones
    ) onlyProjectCreator external {

        uint _miles_id = project_id;
        string memory _project_milestone_description = "Just created";
        uint _milestone_percentage = 1;
        ProjectMilestoneStatus _project_status = ProjectMilestoneStatus.inProgress;
        bool _isReleased = false;
        uint _votingDeadLine = block.timestamp + VOTING_PERIOD;

        ProjectMilestone memory new_milestone = ProjectMilestone(_miles_id, _project_milestone_description, _milestone_percentage, _project_status, _isReleased, _votingDeadLine);

        projects[project_id]._initialMilestones.push(new_milestone);

        isCreator[msg.sender] = true;

        project_id = projectCount + 1;

        Project memory new_project_ = Project({project_id: project_id, project_name: _project_name, project_goal: _project_goal, project_fund: _project_fund, project_timestamp: block.timestamp, project_address: msg.sender, isApprove: false});

        projects[project_id] = new_project_;

        emit MilestoneSubmitted(_projectId, _miles_Id, creator.creator_address);


        emit ProjectCreated (_projectId, _project_address, _project_name, _project_goal, _project_timestamp);
    }

}