import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchJobs } from '../store/slices/jobsSlice';
import { Card, LoadingSpinner } from '@online-hiring-system/ui';

export const JobsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { jobs, isLoading, error, totalCount, searchParams } = useAppSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs(searchParams));
  }, [dispatch, searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading jobs: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
        <p className="text-gray-600">{totalCount} jobs found</p>
      </div>

      <div className="grid gap-6">
        {jobs.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500">No jobs found. Try adjusting your search criteria.</p>
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-gray-600 mt-1">{job.employer.companyName}</p>
                  <p className="text-gray-500 mt-2">{job.location}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.skills.map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-sm text-gray-500">{job.views} views</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    job.status === 'PUBLISHED' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
