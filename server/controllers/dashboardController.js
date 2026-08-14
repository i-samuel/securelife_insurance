const dashboardModel = require('../model/dashboardModel');

const getDashboardStats = async (req, res) => {
  try {
    // If advisor logged in, can filter metrics to advisor's leads if desired
    const advisorFilter = req.user.role === 'ADVISOR' ? req.user.id : null;
    const stats = await dashboardModel.getDashboardStats(advisorFilter);

    return res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error fetching dashboard stats.',
    });
  }
};

module.exports = {
  getDashboardStats,
};
