package com.hirematch.repository;

import com.hirematch.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findTop15ByOrderByCreatedAtDesc();
    List<ActivityLog> findByUserIdOrderByCreatedAtDesc(Long userId);
}
